import { createSlice, current } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
  count: 0,
  timer: 0,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    signOutSuccess: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateSuccess: (state, action) => {
      // Assuming action.payload is the correct structure for updating the user
      const updatedFields = action.payload.updatedFields;

      // Check if the payload has the expected structure
      if (!updatedFields || typeof updatedFields !== "object") {
        state.loading = false;
        state.error = "Invalid payload structure"; // Update with an appropriate error message
        return;
      }

      // Create a copy of currentUser to avoid mutating state directly
      let updatedUser = { ...state.currentUser };

      // Update each nested field dynamically
      for (const fieldPath in updatedFields) {
        const nestedProperties = fieldPath.split(".");
        let nestedObject = updatedUser;

        // Traverse the nested properties to find the correct object to update
        for (let i = 0; i < nestedProperties.length - 1; i++) {
          nestedObject = nestedObject[nestedProperties[i]];
        }

        // Update the final nested property
        nestedObject[nestedProperties[nestedProperties.length - 1]] =
          updatedFields[fieldPath];
      }

      // Update the state with the new user object
      state.currentUser = updatedUser;
      state.loading = false;
      state.error = null;
    },
    UpdateFailure: (state) => {
      state.error = action.payload;
      state.loading = false;
    },
    emailOtpSendStart: (state, action) => {
      state.loading = true;
      state.error = null;
      state.count = 0;
    },
    emailOtpSendSuccess: (state, action) => {
      state.loading = false;
      state.error = null;
    },
    emailOtpSendFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    resetCount: (state) => {
      state.count = 0;
      state.timer = 0;
    },
    emailOtpReceiveFailure: (state, action) => {
      state.count++;
      state.timer = action.payload;
      state.loading = false;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
