import api from "./axios"

export const getMyTasks = async (params) => {
  const res = await api.get('/intern/task')
  return res.data
}

export const getMyPerformance = async (programId) => {
  const res = await api.get(`/performance/intern/${programId}`)
  return res.data
}

export const getMyProgram = async (params) => {
  const res = await api.get("/intern/program")
  return res.data
}

export const submitTask = async (taskId, data) => {
  const res = await api.post(`/intern/task/${taskId}/submit`, data)
  return res.data
}

export const checkCertificateEligibility = async (programId) => {
  const res = await api.get(`/certificate/eligibility/${programId}`)
  return res.data
}

export const generateCertificate = async (programId) => {
  const res = await api.get(
    `/certificate/download/${programId}`,
    { responseType: "blob" }   // ⭐ REQUIRED
  );
  return res.data;
};
