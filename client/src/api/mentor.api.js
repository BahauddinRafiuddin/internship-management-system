import api from "./axios"

export const getMenorDashboard = async (params) => {
  const res = await api.get('/mentor/dashboard')
  return res.data
}

export const getMentorPrograms = async (params) => {
  const res = await api.get('/mentor/programs')
  return res.data
}

export const getMentorInterns = async (params) => {
  const res = await api.get('/mentor/interns')
  return res.data
}

export const getMentorTasks = async () => {
  const res = await api.get('/mentor/tasks')
  return res.data
}

export const reviewTask = async (taskId, data) => {
  const res = await api.put(`/mentor/task/${taskId}/review`, data)
  return res.data
}

export const createTask = async (data) => {
  const res = await api.post('/mentor/task', data)
  return res.data
}

export const getInternPerformance = async (params) => {
  const res = await api.get('/mentor/intern-performance')
  return res.data
}