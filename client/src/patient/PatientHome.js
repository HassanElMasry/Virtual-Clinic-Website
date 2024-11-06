import PatientHeader from "./PatientHeader";
import PatientSidebar from "./PatientSidebar";
import Layout from "../fixed/Layout";

function PatientHome() {
  return (
    <Layout header={<PatientHeader />} sidebar={<PatientSidebar />}></Layout>
  );
}

export default PatientHome;
