// // WIll be deleted

// import { useSelector } from "react-redux";

// import { Button, Label, TextInput, Card } from "flowbite-react";
// import { Link } from "react-router-dom";
// import { useFormik } from "formik";
// import { signUpSchema } from "../helper/validate";
// import axios from "axios";
// import { LiaEyeSolid, LiaEyeSlash } from "react-icons/lia";

// import ProficePicture from "./nestedComponents/ProfilePicture";
// import ProfileAccount from "./nestedComponents/ProfileAccount";

// const DashProfile = () => {
//   const { currentUser } = useSelector((state) => state.user);
//   const initialValues = {
//     Username: "",
//     Email: "",
//     Password: "",
//     RepeatPassword: "",
//   };

//   const baseURL = "http://localhost:443";
//   const formik = useFormik({
//     initialValues: initialValues,
//     validationSchema: signUpSchema,

//     onSubmit: async (values, action) => {
//       console.log("Form values:", values);
//       const postData = {
//         user: values.Username,
//         email: values.Email,
//         password: values.Password,
//       };

//       try {
//         const response = await axios.post(
//           `${baseURL}/update-profile`,
//           postData
//         );
//         console.log(response);
//       } catch (err) {
//         console.log(err.response.data);
//       }
//       action.resetForm();
//     },
//   });
//   return (
//     <div className="flex flex-col gap-4  w-full">
//       {/* Profile Picture */}
//       <ProficePicture />
//       <div className=" flex flex-col gap-6 w-full">
//         {/* Account Part */}
//         <ProfileAccount />
//       </div>
//     </div>
//   );
// };

// export default DashProfile;
