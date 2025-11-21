import Editor from "@/components/Editor";

export default function BlogEditor({ value, onChange }) {
  return (
    <Editor
      value={value}
      onChange={onChange}
      modules={{
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
      }}
      formats={[
        "header",
        "bold",
        "italic",
        "underline",
        "list",
        "link",
        "image",
      ]}
      className="min-h-56 bg-white"
    />
  );
}
