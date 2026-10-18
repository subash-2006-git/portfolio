import PageHeader from "@/components/admin/PageHeader";
import ProjectForm from "../ProjectForm";

export const metadata = { title: "New project" };

export default function NewProjectPage() {
  return (
    <>
      <PageHeader title="New project" back={{ href: "/admin/projects", label: "Projects" }} />
      <ProjectForm />
    </>
  );
}
