import axios from "axios";
import { getStorage } from "../../utils/storage";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  timeout: 30000,
});

const getScrapeData = async () => {
  return await api.post("/get_reviews", {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
  });
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getScrapeData,
};
