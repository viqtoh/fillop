import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import News from "./pages/News";
import Education from "./pages/Education";
import Services from "./pages/Services";
import BlogDetail from "./pages/BlogDetail";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Library from "./pages/Library";
import Achievements from "./pages/Achievements";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import LearnPath from "./pages/LearnPath";
import Course from "./pages/Course";
import CourseRead from "./pages/CourseRead";
import VerifyOtp from "./pages/VerifyOtp";

import AdminHome from "./adminPages/Home";

import AdminDashboard from "./adminPages/Dashboard";
import UserManagement from "./adminPages/UserManagement";
import StaffManagement from "./adminPages/StaffManagement";
import NewsManagement from "./adminPages/NewsManagement";
import ContentManagement from "./adminPages/ContentManagement";
import CreateContent from "./adminPages/CreateContent";
import CategoryManagement from "./adminPages/CategoryManagement";
import AdminLearnPath from "./adminPages/LearnPath";
import AdminProfile from "./adminPages/Profile";
import AdminCourse from "./adminPages/Course";
import AdminModuleCrud from "./adminPages/AdminModuleCrud";
import AdminSetAssessment from "./adminPages/AdminSetAssessment";

import LecturerDashboard from "./lecturerPages/Dashboard";
import LecturerLibrary from "./lecturerPages/Library";
import LecturerProfile from "./lecturerPages/Profile";
import LecturerLearnPath from "./lecturerPages/LearnPath";
import LecturerCourse from "./lecturerPages/Course";
import LecturerCreateContent from "./lecturerPages/LecturerCreateContent";
import AdminCourseRead from "./adminPages/AdminCourseRead";
import ServiceManagement from "./adminPages/ServiceManagement";

function App() {
  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:slug" element={<BlogDetail />} />
        <Route path="/education" element={<Education />} />
        <Route path="/services" element={<Services />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/content-library" element={<Library />} />
        <Route path="/content-library/path/:id" element={<LearnPath />} />
        <Route path="/content-library/course/:id" element={<Course />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/account/settings" element={<Profile />} />
        <Route path="/content-library/path/:pathId/read" element={<CourseRead />} />
        <Route path="/content-library/course/:id/read" element={<CourseRead />} />
        <Route path="/verify-email" element={<VerifyOtp />} />

        {/* Lecturer Routes */}
        <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
        <Route path="/lecturer/content-library" element={<LecturerLibrary />} />
        <Route path="/lecturer/account/settings" element={<LecturerProfile />} />
        <Route path="/lecturer/content-library/course/:id" element={<LecturerCourse />} />
        <Route
          path="/lecturer/content-library/path/:pathId/course/:id"
          element={<LecturerCourse />}
        />
        <Route path="/lecturer/content-library/path/:id" element={<LecturerLearnPath />} />
        <Route path="/lecturer/content-library/create" element={<LecturerCreateContent />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/content-management" element={<ContentManagement />} />
        <Route path="/admin/content-management/create" element={<CreateContent />} />
        <Route path="/admin/content-management/course/:id" element={<AdminCourse />} />
        <Route path="/admin/content-management/path/:pathId/course/:id" element={<AdminCourse />} />
        <Route
          path="/admin/content-management/course/:id/module/create"
          element={<AdminModuleCrud />}
        />
        <Route
          path="/admin/content-management/course/:id/module/edit/:moduleId"
          element={<AdminModuleCrud />}
        />
        <Route path="/admin/content-management/path/:id" element={<AdminLearnPath />} />
        <Route path="/admin/content-management/path/:pathId/read" element={<AdminCourseRead />} />
        <Route path="/admin/content-management/course/:id/read" element={<AdminCourseRead />} />
        <Route path="/admin/category-management" element={<CategoryManagement />} />
        <Route path="/admin/user-management" element={<UserManagement />} />
        <Route path="/admin/staff-management" element={<StaffManagement />} />
        <Route path="/admin/news-management" element={<NewsManagement />} />
        <Route path="/admin/account/settings" element={<AdminProfile />} />
        <Route path="/admin/service-management" element={<ServiceManagement />} />

        <Route
          path="/admin/content-management/course/module/:id/assessment"
          element={<AdminSetAssessment />}
        />
      </Routes>
    </Router>
  );
}

export default App;
