import axios from "axios";

export const httpCommon = axios.create({
  baseURL:'http://localhost:3000/'
})