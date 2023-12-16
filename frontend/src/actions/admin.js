import api from '../utils/api';
import {
    RETRIEVE_DATA,
} from './types'

// Retrieve current category from backend
export const retrieveData = () => async (dispatch) => {

  try {
    const res = await api.get('/category');

    dispatch({
      type: RETRIEVE_DATA,
      payload: res.data
    });

  } catch (err) {
    const errors = err.response.data.errors;
  }
};

// Create Category
export const createCategory = (data) => async (dispatch) => {

  try {
    const res = await api.put('/category', data);

    dispatch({
      type: RETRIEVE_DATA,
      payload: res.data
    }); 

  } catch (err) {
    const errors = err.response.data.errors;   
  }
};
export const deleteCategory = (id) => async (dispatch) => {

  
  try {
    const res = await api.delete(`/category/${id}`);

    dispatch({
      type: RETRIEVE_DATA,
      payload: res.data
    }); 

  } catch (err) {
    const errors = err.response.data.errors;   
  }
};
export const EditSubCategoryById = (id, subcategory) => async (dispatch) => {
  try {
    const res = await api.post(`/category/${id}`, subcategory);

    dispatch({
      type: RETRIEVE_DATA,
      payload: res.data
    }); 

  } catch (err) {
    const errors = err.response.data.errors;   
  }
};