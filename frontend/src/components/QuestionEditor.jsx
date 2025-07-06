import React, { useEffect } from "react";
import { FaCheck, FaTimes, FaGripVertical } from "react-icons/fa";

function QuestionEditor({ index, data, onChange, onDelete, onOptDelete, modules }) {
  const [answers, setAnswers] = React.useState(data.answers);

  const handleQuestionChange = (e) => {
    onChange({ ...data, question: e.target.value });
  };

  const handleAnswerChange = (answerId, text) => {
    const updatedAnswers = data.answers.map((a) => (a.qid === answerId ? { ...a, text } : a));
    setAnswers(answers.map((a) => (a.qid === answerId ? { ...a, text } : a)));
    onChange({ ...data, answers: updatedAnswers });
  };

  const toggleCorrect = (answerId) => {
    const updatedAnswers = data.answers.map((a) =>
      a.qid === answerId ? { ...a, correct: !a.correct } : a
    );
    setAnswers(answers.map((a) => (a.qid === answerId ? { ...a, correct: !a.correct } : a)));
    onChange({ ...data, answers: updatedAnswers });
  };

  const addAnswer = () => {
    const newId = Math.max(0, ...data.answers.map((a) => a.qid)) + 1;
    const newAnswer = {
      qid: newId,
      text: "",
      correct: false
    };
    onChange({ ...data, answers: [...data.answers, newAnswer] });
    setAnswers([...answers, newAnswer]);
  };

  const deleteAnswer = (answerId) => {
    const updatedAnswers = data.answers.map((a) =>
      a.qid === answerId ? { ...a, delete: true } : a
    );
    setAnswers(updatedAnswers);
    onOptDelete(answerId, data.id);
  };

  const filteredAnswers = answers.filter((answer) => !answer.delete);

  return (
    <div className="examcard p-4 mb-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Question {index}</h5>
        <button className="btn-close" onClick={() => onDelete(data.id)} />
      </div>

      <textarea
        className="form-control mb-4"
        placeholder="The highest peak in Poland is:"
        value={data.question}
        onChange={handleQuestionChange}
        rows="3"
      />

      {filteredAnswers.map((answer, index) => (
        <div key={answer.id} className="d-flex align-items-center mb-2">
          <div className="me-2 text-muted">
            <FaGripVertical />
          </div>
          <div className="me-2 fw-bold">{String.fromCharCode(65 + index)}</div>
          <input
            type="text"
            className="form-control me-2"
            value={answer.text}
            onChange={(e) => handleAnswerChange(answer.qid, e.target.value)}
          />
          <button
            className={`btn btn-sm me-1 ${answer.correct ? "btn-success" : "btn-outline-success"}`}
            onClick={() => toggleCorrect(answer.qid)}
          >
            <FaCheck />
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => deleteAnswer(answer.qid)}
          >
            <FaTimes />
          </button>
        </div>
      ))}

      <div className="w-100 d-flex justify-content-center mt-5">
        <select
          className="form-select me-3"
          value={data.module || ""}
          onChange={(e) => onChange({ ...data, module: e.target.value })}
        >
          <option value="">Select module</option>
          {modules &&
            modules.map((module) => (
              <option key={module.id} value={module.id}>
                {module.title}
              </option>
            ))}
          {(!modules || modules.length === 0) && <option value="">No modules available</option>}
        </select>
        <button className="addOptionBtn" onClick={addAnswer}>
          More Options +
        </button>
      </div>
    </div>
  );
}

export default QuestionEditor;
