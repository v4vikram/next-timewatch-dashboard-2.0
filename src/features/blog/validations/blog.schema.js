import * as Yup from "yup";

export const blogSchema = Yup.object({
  title: Yup.string().required("Title required"),
  slug: Yup.string().required(),
});
