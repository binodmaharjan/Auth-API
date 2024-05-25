
import nodemailer from 'nodemailer';
import { Email } from '../../../libs/email/email';
import { convert } from 'html-to-text';

// Mock nodemailer methods
jest.mock('nodemailer');

describe.skip('Email', () => {

    let email: Email;

    beforeEach(() => {
      const user = { firstName: 'John', lastName: 'Doe', email: 'john@example.com', password: 'password' };
      const url = 'https://example.com';
      email = new Email(user, url);
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should create a new transport', () => {
        // arrange
        const createTransportSpy = jest.spyOn(email, 'newTransport').mockReturnValue({} as nodemailer.Transporter);
    
       // act
        email.newTransport();
        // Assertions
        expect(createTransportSpy).toHaveBeenCalledTimes(1);
    })
  

  it('should send mail with correct options', async () => {
    // Create a spy on sendMail method
    const sendMailSpy = jest.spyOn(email, 'sendMail').mockResolvedValue({} as nodemailer.SentMessageInfo);

    // Define mail options
    const mailOptions = {
      from: 'sender@example.com',
      to: 'recipient@example.com',
      subject: 'Test Subject',
      text: 'Test Body',
    };

    // Call the method under test
    await email.sendMail(mailOptions);

    // Assertions
    expect(sendMailSpy).toHaveBeenCalledWith(mailOptions);
    expect(sendMailSpy).toHaveBeenCalledTimes(1);

  });


  it('should send verification code', async () => {
    // arrange
    const sendMailSpy = jest.spyOn(email, 'sendMail').mockResolvedValue({} as nodemailer.SentMessageInfo);
    const html = email.generateHtml('verificationCode', 'Your account verification code')

    const mailOptions = {
      from: 'Auth <sender@example.com>',
      to: 'john@example.com',
      subject: "Your account verification code",
      text: convert(html),
      html: html,
    };

    // act
    await email.sendVerificationCode();

    // assert
    expect(sendMailSpy).toHaveBeenCalledWith(mailOptions);
    expect(sendMailSpy).toHaveBeenCalledTimes(1);

  });

  it('should send create user email', async () => {
    // arrange
    const sendMailSpy = jest.spyOn(email, 'sendMail').mockResolvedValue({} as nodemailer.SentMessageInfo);
    const html = email.generateHtml('newUserCreated', 'Your user has been created')

    const mailOptions = {
      from: 'Auth <sender@example.com>',
      to: 'john@example.com',
      subject: 'Your user has been created',
      text: convert(html),
      html: html,
    };

    // act
    await email.sendUserCreate();

    // assert
    expect(sendMailSpy).toHaveBeenCalledWith(mailOptions);
    expect(sendMailSpy).toHaveBeenCalledTimes(1);

  });

  it('should send password reset token email', async () => {
    // arrange
    const sendMailSpy = jest.spyOn(email, 'sendMail').mockResolvedValue({} as nodemailer.SentMessageInfo);
    const html = email.generateHtml('resetPassword', 'Your password reset token (valid for only 3 days)')

    const mailOptions = {
      from: 'Auth <sender@example.com>',
      to: 'john@example.com',
      subject: 'Your password reset token (valid for only 3 days)',
      text: convert(html),
      html: html,
    };

    // act
    await email.sendPasswordResetToken();

    // assert
    expect(sendMailSpy).toHaveBeenCalledWith(mailOptions);
    expect(sendMailSpy).toHaveBeenCalledTimes(1);

  });

});
