import * as Yup from "yup";

export const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});




const addressSchema = Yup.object().shape({
  fullName: Yup.string().required("Full name is required"),
  address: Yup.string().required("Address is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  postalCode: Yup.string().required("Postal code is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Enter valid 10-digit phone")
    .required("Phone is required"),
  country: Yup.string().required("Country is required"),
});

export const CheckoutSchema = Yup.object().shape({
  shipping: addressSchema,
  billing: addressSchema,
});
