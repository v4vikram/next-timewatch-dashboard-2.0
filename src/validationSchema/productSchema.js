import * as Yup from "yup";
export const productCreateSchema = Yup.object({
  productName: Yup.string().required("Required"),
  // productImage: Yup.string().required("Required"),
});