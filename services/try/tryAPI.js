import axios from "axios";
import { getStorage } from "../../utils/storage";

const Try = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  timeout: 30000,
});

const getScrapeData = async (data) => {
  return await Try.post("/get_reviews", data, {
    headers: {
      Authorization: `${getStorage("access_token")}`,
    },
  });
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {

  // POST
  getScrapeData,
};
