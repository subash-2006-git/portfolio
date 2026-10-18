import PageHeader from "@/components/admin/PageHeader";
import ExperienceForm from "../ExperienceForm";

export const metadata = { title: "New experience" };

export default function NewExperiencePage() {
  return (
    <>
      <PageHeader title="New experience" back={{ href: "/admin/experience", label: "Experience" }} />
      <ExperienceForm />
    </>
  );
}
