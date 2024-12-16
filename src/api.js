import axios from "axios";


const api = axios.create({
    baseURL: 'http://localhost:8082',
});


export const fetchBankAccounts  = async () => {
  const response = await api.get('/banque/comptes');
  return response.data;
}

export const createCompte = async (accountData) => {
  try {
    const response = await api.post('/banque/comptes', accountData);
    return response.data;
  } catch (err) {
    throw new Error("Failed to create the account. Please try again later.");
  }
};

export const updateBankAccount = async (id, compteDetails) => {
  try {
    console.log("compte details ---->", compteDetails);
    const response = await api.put(
      `/banque/comptes/${id}`, 
      compteDetails,
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      }
    );
    console.log("Updated Compte:", response.data);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response);
    } else {
      console.error("Error updating compte:", error.message);
    }
    throw error;
  }
};



export const deleteBankAccount = async (id) => {
  try {
    const response = await api.delete(`/banque/comptes/${id}`);
    console.log("Deleted Compte:", response.status);
    return response.status;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.error("Compte not found");
    } else {
      console.error("Error deleting compte:", error.message);
    }
    throw error;
  }
};

