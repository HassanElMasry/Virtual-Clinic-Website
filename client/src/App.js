import "./App.css";

import Home from "./home/Home";
import RegistrationForm from "./RegistrationForm";
import Login from "./Login";
import ChangePassword from "./ChangePassword";
import ForgotPassword from "./ForgotPassword";

import AdminHome from "./admin/AdminHome";
import AdminForm from "./admin/AdminForm";
import AdminList from "./admin/AdminList";
import PatientList from "./admin/PatientList";
import DoctorList from "./admin/DoctorList";
import RequestList from "./admin/RequestList";
import Packages from "./admin/Packages";

import PatientHome from "./patient/PatientHome";
import AddFamilyMember from "./patient/AddFamilyMember";
import FamilyMemberList from "./patient/FamilyMemberList";
import PrescriptionList from "./patient/PrescriptionList";
import DoctorList2 from "./patient/DoctorList";
import HealthRecordsUpload from "./patient/HealthRecordsUpload";
import HealthPackages from "./patient/HealthPackages";

import DoctorHome from "./doctor/DoctorHome";
import DoctorEdit from "./doctor/DoctorEdit";
import DoctorPatientList from "./doctor/PatientList";
import EmploymentContract from "./doctor/EmploymentContract";
import AddAvailableTimeSlot from "./doctor/AddAvailableTimeSlot";
import FollowUps from "./doctor/FollowUps";

import AppointmentList from "./AppointmentList";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import DoctorRequest from "./DoctorRequest";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import AppointmentApproved from "./patient/AppointmentApproved";

import ChatRoom from "./ChatRoom";
import Room from "./Room";

const stripePromise = loadStripe(
  "pk_test_51OWPuDBfH26uclDP6c9lfS4HPHG7AaK4W0m3uLnmZfyNeXU0muRv00Tigf8yTdMjcUZQKtfxVIe6ukSvjKUb4Hev00Ig174lsV"
);

function App() {
  return (
    <>
      <Elements stripe={stripePromise}>
        <Router>
          <div className="App">
            <div className="content">
              <Switch>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route exact path="/change-password">
                  <ChangePassword />
                </Route>
                <Route exact path="/forgot-password">
                  <ForgotPassword />
                </Route>
                <Route exact path="/login">
                  <Login />
                </Route>
                <Route exact path="/register-patient">
                  <RegistrationForm />
                </Route>
                <Route exact path="/submit-doctor-request">
                  <DoctorRequest />
                </Route>
                <Route exact path="/admin">
                  <AdminHome />
                </Route>
                <Route exact path="/admin/add-admin">
                  <AdminForm />
                </Route>
                <Route exact path="/admin/admin-list">
                  <AdminList />
                </Route>
                <Route exact path="/admin/patient-list">
                  <PatientList />
                </Route>
                <Route exact path="/admin/doctor-list">
                  <DoctorList />
                </Route>
                <Route exact path="/admin/request-list">
                  <RequestList />
                </Route>
                <Route exact path="/admin/packages">
                  <Packages />
                </Route>
                <Route exact path="/patient">
                  <PatientHome />
                </Route>
                <Route exact path="/patient/add-family-member">
                  <AddFamilyMember />
                </Route>
                <Route exact path="/patient/family-member-list">
                  <FamilyMemberList />
                </Route>
                <Route exact path="/patient/prescription-list">
                  <PrescriptionList />
                </Route>
                <Route exact path="/patient/appointment-list">
                  <AppointmentList />
                </Route>
                <Route exact path="/patient/doctor-list">
                  <DoctorList2 />
                </Route>
                <Route exact path="/patient/health-records-upload">
                  <HealthRecordsUpload />
                </Route>
                <Route exact path="/patient/packages">
                  <HealthPackages />
                </Route>
                <Route exact path="/patient/appointment-approved">
                  <AppointmentApproved />
                </Route>
                <Route exact path="/doctor">
                  <DoctorHome />
                </Route>
                <Route exact path="/doctor/appointment-list">
                  <AppointmentList />
                </Route>
                <Route exact path="/doctor/appointment-list">
                  <AppointmentList />
                </Route>
                <Route exact path="/doctor/edit">
                  <DoctorEdit />
                </Route>
                <Route exact path="/doctor/patient-list">
                  <DoctorPatientList />
                </Route>
                <Route exact path="/doctor/employment-contract">
                  <EmploymentContract />
                </Route>
                <Route exact path="/doctor/add-available-time-slot">
                  <AddAvailableTimeSlot />
                </Route>
                <Route exact path="/doctor/follow-up-list">
                  <FollowUps />
                </Route>
                <Route path="/chat" component={ChatRoom} />
                <Route path="/room/:roomID" component={Room} />
              </Switch>
            </div>
            {/* <Footer /> */}
          </div>
        </Router>
      </Elements>
    </>
  );
}

export default App;
