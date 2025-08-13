import * as Yup from "yup";  
  export const productCreateSchema = Yup.object({
    categoryName: Yup.string().required("Required"),
    subCategoryName: Yup.string().required("Required"),
    productName: Yup.string().required("Required"),
    description: Yup.string().required("Required"),
    productImage: Yup.string().required("Required"),
    datasheetLink: Yup.string().required("Required"),
    connectionDiagramLink: Yup.string().required("Required"),
    userManualLink: Yup.string().required("Required"),
    productkeywords: Yup.string().required("Required"),
    features: Yup.array().of(
      Yup.object({
        title: Yup.string().required("Required"),
        image: Yup.string().required("Required"),
      })
    ),
    table: Yup.array().of(
      Yup.object({
        column1: Yup.string().required("Required"),
        column2: Yup.string().required("Required"),
      })
    ),
    status: Yup.string()
      .oneOf(["draft", "pending", "published"])
      .required("Status is required"),
  });