export const storeInSession = (key, value) => {
  try {
    const json = JSON.stringify(value);
    sessionStorage.setItem(key, json);
  } catch (error) {
    console.error("Lỗi khi lưu vào session:", error);
  }
};

export const lookInSession = (key) => {
  try {
    const item = sessionStorage.getItem(key);
    if (!item) return null;
    return JSON.parse(item);
  } catch (error) {
    console.error("Lỗi khi đọc session:", error);
    return null;
  }
};

export const removeFromSession = (key) => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    console.error("Lỗi khi xóa session:", error);
  }
};

export const logOutUser = () => {
  try {
    sessionStorage.clear();
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
  }
};
