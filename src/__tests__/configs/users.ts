import { hash } from "../../utils/AuthUtils";

export const users = [{
    userName: 'testuser',
    email: 'john@doe.com',
    password: hash('password'),
    role: "CLIENT",
    isActive: true,
    verified: true
},
{
    userName: 'testuser2',
    email: 'admin@gmail.com',
    password: hash('password'),
    role: "ADMIN",
    isActive: true,
    verified: true
}
];