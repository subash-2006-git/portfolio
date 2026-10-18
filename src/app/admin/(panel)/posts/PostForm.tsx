import AdminForm from "@/components/admin/AdminForm";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import { Card, Checkbox, Field, TextArea } from "@/components/admin/fields";
import { savePost } from "@/app/admin/actions/posts";
import type { Post } from "@/lib/types";

export default function PostForm({ post }: { post?: Post }) {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <AdminForm action={savePost.bind(null, post?.id ?? null)} submitLabel={post ? "Save post" : "Create post"}>
      <Card title="Post">
        <Field name="title" label="Title" defaultValue={post?.title} required />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="slug" label="URL slug" hint="Leave blank to generate from the title." defaultValue={post?.slug} placeholder="my-first-post" />
          <Field name="date" label="Publish date" type="date" defaultValue={post?.date ?? today} required />
        </div>
        <TextArea name="summary" label="Summary" hint="One sentence, shown in post lists and search results." rows={2} defaultValue={post?.summary} />
        <MarkdownEditor name="content" defaultValue={post?.content} />
      </Card>
      <Card title="Visibility">
        <Checkbox name="published" label="Published" hint="Unpublished posts are drafts that only you can see." defaultChecked={post?.published ?? false} />
      </Card>
    </AdminForm>
  );
}
