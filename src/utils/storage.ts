export function setAppUserInfo(info: UserInfo) {
  localStorage.setItem(
    import.meta.env.VITE_APP_USER_INFO,
    JSON.stringify(info)
  );
}

export function getAppUserInfo(): {
  phone: string;
} | null {
  const info = localStorage.getItem(import.meta.env.VITE_APP_USER_INFO);
  return info ? JSON.parse(info) : info;
}

export function removeAppUserInfo() {
  localStorage.removeItem(import.meta.env.VITE_APP_USER_INFO);
}
