const SERVER_URL = import.meta.env.VITE_PROD_BASE_URL;

export const deleteUser = async (userId) => {
   try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${SERVER_URL}/api/user/delete/${userId}`, {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
         },
      });
      const data = await res.json();
      return { success: res.ok, data };
   } catch (error) {
      return { success: false, error: error.message };
   }
};
