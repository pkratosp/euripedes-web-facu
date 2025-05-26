import axios, { AxiosError, AxiosInstance } from "axios";
import { AppError } from "./appErorr";

type SingOut = () => void;

type APIInstanceProps = AxiosInstance & {
  registerIntercepTokenMenager: (singOut: SingOut) => () => void;
};

// type PromiseType = {
//   onSuccess: (token: string) => void;
//   onFailure: (error: AxiosError) => void;
// };

const api = axios.create({
  baseURL: process.env.api,
}) as APIInstanceProps;

api.registerIntercepTokenMenager = (singOut) => {
  const interceptTokenManager = api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (requestError) => {
      console.log(requestError.response, " --- ERRROR");
      if (requestError.response?.status === 401) {
        singOut();
        return;
      }

      if (requestError.response?.status === 400) {
        return Promise.reject(
          new AppError(
            requestError.response.data,
            requestError.response?.status
          )
        );
      }

      return Promise.reject(requestError);
    }
  );

  return () => {
    api.interceptors.response.eject(interceptTokenManager);
  };
};

export { api };
