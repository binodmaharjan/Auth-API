
import request from 'supertest'
import { app } from "./../../app";
import { Email } from "./../../libs/email/email";
import { Users } from '../../models/users';
import moment from 'moment';
import { ResetPassword } from '../../models/resetpassword';
import { truncateAllTables, loadFixtures } from '../configs/fixtures';

jest.mock('./../../libs/email/email'); // Mock the email module

beforeEach(async () => {
  truncateAllTables()
  await loadFixtures()
});

describe('AuthController', () => {
  describe('register', () => {
    it('should register a new user', async () => {
      // Arrange 
      Email.prototype.sendUserCreate = jest.fn().mockResolvedValueOnce(true); // Mock sendUserCreate method

      // Act
      const response = await request(app)
        .post('/api/auth/create')
        .send({
          userName: 'firstUser',
          email: 'test@example.com',
          password: 'password123',
          role: "CLIENT",
          isActive: true,
          verified: true
        });

      // Assert
      expect(response.status).toBe(201);
      expect(Email.prototype.sendUserCreate).toHaveBeenCalledTimes(1); // Ensure sendUserCreate was called

      const user = await Users.findOne({ where: { email: 'test@example.com' } });
      expect(user).not.toBeNull();
      expect(user?.userName).toBe('firstUser');
    });
  });

  describe('login', () => {
    it('should login a user', async () => {

      // Act
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'john@doe.com',
          password: 'password'
        });

      // Assert
      expect(response.status).toBe(200);
    });
  });

  describe('forgotPassword', () => {
    it('should send a reset password email', async () => {
      // Arrange
      Email.prototype.sendPasswordResetToken = jest.fn().mockResolvedValueOnce(true); // Mock sendResetPassword method

      // Act
      const response = await request(app)
        .post('/api/auth/forgotpassword')
        .send({
          email: 'john@doe.com'
        });

      // Assert
      expect(response.status).toBe(201);
      expect(Email.prototype.sendPasswordResetToken).toHaveBeenCalledTimes(1); // Ensure sendResetPassword was called
      });
    });


  describe('resetPassword', () => {
    it('should reset a user password', async () => {
      // Arrange
      const resetToken = 'randomToken'
      await ResetPassword.create({
        email: "john@doe.com",
        token: resetToken,
        expiredAt: moment().add(3, 'days'),
      })

      // Act
      const response = await request(app)
        .post(`/api/auth/resetpassword/${resetToken}`)
        .send({
          password: 'newPassword'
        });

      // Assert
      expect(response.status).toBe(201);
    
    })
  })


  describe('changePassword', () => {
    it('should change a user password', async () => {
      // Arrange
      const userLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'john@doe.com',
        password: 'password'
      });

      const token = userLogin.body.result.token;
      const resp = await request(app)
      .post('/api/auth/changepassword')
      .set('Authorization', `Bearer ${token}`)
      .send({
        oldPassword: 'password',
        password: 'newPassword',
        confirmPassword: 'newPassword'
      });

      // Assert
      expect(resp.status).toBe(201);


    });
  });



});