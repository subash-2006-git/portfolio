import PageHeader from "@/components/admin/PageHeader";
import PostForm from "../PostForm";

export const metadata = { title: "New post" };

export default function NewPostPage() {
  return (
    <>
      <PageHeader title="New post" back={{ href: "/admin/posts", label: "Blog posts" }} />
      <PostForm />
    </>
  );
}
