import DoctorHeader from "./DoctorHeader";
import DoctorSidebar from "./DoctorSidebar";
import Layout from "../fixed/Layout";

function DoctorHome() {
  return (
    <Layout header={<DoctorHeader />} sidebar={<DoctorSidebar />}></Layout>
  );
}

export default DoctorHome;
