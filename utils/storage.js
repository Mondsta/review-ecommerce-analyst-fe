export const getStorage = (key) => {
  return localStorage.getItem(key);
};

export const setStorage = (key, val) => {
  return localStorage.setItem(key, val);
};

export const deleteStorage = (key) => {
  return localStorage.removeItem(key);
};

export const clearStorage = () => {
  localStorage.clear();
};
