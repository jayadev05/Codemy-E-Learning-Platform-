import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import adminSlice from './adminSlice';
import tutorSlice from './tutorSlice'

const store = configureStore({
  reducer: {
    user:userSlice,
    admin:adminSlice,
    tutor:tutorSlice
  },
});

export default store;

