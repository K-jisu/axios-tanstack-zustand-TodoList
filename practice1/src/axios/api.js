import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
});

// 인터셉터 사용할 수 있으면 사용하기

api.interceptors.request.use((config) => {
  // 필요한 과정들
  // console.log("인터셉트 요청 성공");

  return config;
});

api.interceptors.response.use(
  (response) => {
    // console.log("응답 받음");
    return response;
  },
  (error) => {
    // console.log("인터셉트 응답을 받지 못했습니다.", error);
    return Promise.reject(error);
  }
);

export default api;
