// email.js

import nodemailer from 'nodemailer';
import pug from 'pug';
import { convert } from 'html-to-text';

export type EMAIL_TEMPLATE =
  | 'verificationCode'
  | 'resetPassword'
  | 'newUserCreated';

const smtp = {
  host: process.env.EMAIL_HOST as string,
  port: Number(process.env.EMAIL_PORT as string),
  user: process.env.EMAIL_USER as string,
  pass: process.env.EMAIL_PASS as string,
};

interface UserProps {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export class Email {
  private emailFrom: string;

  constructor(private readonly user: UserProps, private url: string) {
    this.emailFrom = `Auth-API <${smtp.user}>`;
  }

  public newTransport() {
    return nodemailer.createTransport({
      ...smtp,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
    });
  }

  public async sendMail(mailOptions: nodemailer.SendMailOptions) {
    return await this.newTransport().sendMail(mailOptions);
  }

  public generateHtml(template: EMAIL_TEMPLATE, subject: string) {
    return pug.renderFile(`${__dirname}/../../views/${template}.pug`, {
      firstName: this.user.firstName ?? '',
      lastName: this.user.lastName ?? '',
      email: this.user.email ?? '',
      password: this.user.password ?? '',
      subject,
      url: this.url,
    });
  }

  async send(template: EMAIL_TEMPLATE, subject: string) {
    const html = this.generateHtml(template, subject);

    const mailOptions = {
      from: this.emailFrom,
      to: this.user.email,
      subject,
      text: convert(html),
      html,
    };

    const info = await this.sendMail(mailOptions);
    console.log(nodemailer.getTestMessageUrl(info));
  }

  async sendVerificationCode() {
    await this.send('verificationCode', 'Your account verification code');
  }

  async sendPasswordResetToken() {
    await this.send(
      'resetPassword',
      'Your password reset token (valid for only 3 days)'
    );
  }

  async sendUserCreate() {
    await this.send('newUserCreated', 'Your user has been created');
  }
}
