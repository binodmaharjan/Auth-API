export const ConstantRoutes = {
  baseUrl: '/api',
  test: {
    getTests: '/tests',
  },
  auth: {
    login: '/auth/login',
    register: '/auth/create',
    refreshToken: '/auth/refresh/token',
    forgotPassword: '/auth/forgotpassword',
    resetPassword: '/auth/resetpassword/:resetToken',
    changePassword: '/auth/changepassword',
  },
  user: {
    getRoute: '/users',
    getCoachRoute: '/coach',
    postRoute: '/user',
    putRoute: '/user/:id',
    deleteRoute: '/user/:id',
    getSingleRoute: '/user/:id',
    getClientsOfCoachRoute: '/user/:coachId/clients',
    getCSV: '/csv/users',
    updateConsent: '/user/consents/:id',
    getConsent: '/user/consents/:id',
  },
};
