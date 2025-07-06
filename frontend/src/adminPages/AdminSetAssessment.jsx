import React, { useState, useEffect, useRef } from "react";
import AdminNavBar from "../components/AdminNavBar";
import "../styles/home.css";
import { API_URL, IMAGE_HOST } from "../constants";
import "bootstrap/dist/css/bootstrap.min.css";
import Toast from "../components/Toast";
import { faSearch, faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import Select from "react-select";
import QuestionEditor from "../components/QuestionEditor";
import { useParams } from "react-router-dom";

const AdminSetAssessment = () => {
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(true);
  const debounceTimer = useRef(null);
  const [modules, setModules] = useState([]);
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: "",
      answers: [
        { id: 1, text: "", correct: false },
        { id: 2, text: "", correct: false }
      ]
    }
  ]);

  const [isSuccess, setIsSuccess] = React.useState(true);
  const [toast, setToast] = useState(null);
  const showToast = React.useCallback((message, success = true) => {
    setToast(message);
    setIsSuccess(success);
    setTimeout(() => setToast(null), 5000); // Hide after 5s
  }, []);
  const [title, setTitle] = useState("");

  const [isLoaded, setIsLoaded] = useState(false);

  const fetchAssessment = async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/assessment/module/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      setTitle(data.title);
      setModules(data.modules);

      if (data.questions.length > 0) {
        setQuestions(data.questions);
      }

      setFormData({
        title: data.title,
        description: data.description || "",
        duration: data.duration || "",
        numberOfQuestions: data.numberOfQuestions || ""
      });
      setIsLoaded(true);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionChange = (updatedQuestion) => {
    setQuestions((prev) => prev.map((q) => (q.id === updatedQuestion.id ? updatedQuestion : q)));
    setSaved(false); // Mark unsaved
  };

  useEffect(() => {
    if (!isLoaded) {
      fetchAssessment();
    }
  }, [isLoaded]);

  useEffect(() => {
    // Clear any pending save
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new 3-second delay to save
    debounceTimer.current = setTimeout(() => {
      if (!saved) {
        updateAssessment();
        setSaved(true);
      } // Mark as saved
    }, 3000);

    // Cleanup on unmount or before new effect
    return () => clearTimeout(debounceTimer.current);
  }, [questions]);

  const updateAssessment = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/assessment/module/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(questions)
      });
      const data = await response.json();

      if (data.questions.length > 0) {
        setQuestions(data.questions);
      }

      setSaved(true);
    } catch (error) {
    } finally {
      setIsSaving(false);
    }
  };

  const deleteQuestion = async (questionId) => {
    setQuestions((prev) => prev.filter((q) => q.id !== questionId));
    setSaved(false); // Mark unsaved
  };

  const deleteOption = async (optionId, questionId) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.map((opt) =>
                opt.qid === optionId ? { ...opt, delete: true } : opt
              )
            }
          : q
      )
    );
    setSaved(false); // Mark unsaved
  };

  const handleDeleteQuestion = (id) => {
    deleteQuestion(id);
  };

  const handleOptionDelete = (id, qid) => {
    deleteOption(id, qid);
  };

  const addNewQuestion = () => {
    const newId = Math.max(0, ...questions.map((q) => q.id)) + 1;
    setQuestions((prev) => [
      ...prev,
      {
        aid: newId,
        question: "",
        answers: [
          { qid: 1, text: "", correct: false },
          { qid: 2, text: "", correct: false }
        ]
      }
    ]);
  };

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    numberOfQuestions: ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch(
        `${API_URL}/api/admin/assessment/module/${id}/update/descriptions`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update category");
      }

      const data = await response.json();
      if (data.error) {
        showToast(data.error, false);
      } else {
        showToast("Assessment updated successfully", true);
        setShowModal(false);
      }
    } catch (error) {
      showToast("Failed to update category", false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div className="navHeader">
        <AdminNavBar title={`Set Assessment - ${title}`} />
      </div>
      <div className="main-body5 main-body main-body3 main-body4">
        {toast && <Toast message={toast} onClose={() => setToast(null)} isSuccess={isSuccess} />}
        {isLoading ? (
          <div className="loader-container">
            <div className="loader"></div>
          </div>
        ) : (
          <div className="sub-body">
            <div className="w-100 d-flex justify-content-between mb-5">
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                Edit Assessment
              </button>
              {!isSaving ? (
                <span className="saved-text">
                  <div />
                  Saved
                </span>
              ) : (
                <span className="saving-text">
                  <div className="loader small-loader"></div>
                  Saving...
                </span>
              )}
            </div>
            <div className="AssessmentCon">
              {questions.map((question, index) => (
                <QuestionEditor
                  key={question.id}
                  index={index + 1}
                  data={question}
                  onChange={handleQuestionChange}
                  onDelete={handleDeleteQuestion}
                  onOptDelete={handleOptionDelete}
                  modules={modules}
                />
              ))}

              <button className="btn btn-primary" onClick={addNewQuestion}>
                Add New Question
              </button>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3 className="mb-5">Edit Assessment</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="description">Title</label>

                <input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="duration">Number of questions</label>
                <input
                  type="number"
                  id="numberOfQuestions"
                  name="numberOfQuestions"
                  value={formData.numberOfQuestions}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="duration">Duration (mins)</label>
                <input
                  type="number"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                />
              </div>
              <div className="form-actions justify-content-between w-100 d-flex">
                {isSaving ? (
                  <button className="btn btn-theme" disabled>
                    <div className="loader small-loader"></div>
                  </button>
                ) : (
                  <button type="submit" className="btn btn-theme">
                    Save
                  </button>
                )}

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSetAssessment;
