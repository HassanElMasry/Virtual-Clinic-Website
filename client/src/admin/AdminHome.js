import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import Layout from "../fixed/Layout";

function AdminHome() {
  return <Layout header={<AdminHeader />} sidebar={<AdminSidebar />}></Layout>;
}

export default AdminHome;
