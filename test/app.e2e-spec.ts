import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import { DbService } from '../src/db/db.service';
import { SignInDTO, SignUpDTO } from 'src/auth/DTO';
import * as pactum from 'pactum';

describe('Appe2e', () => {
    let app: INestApplication;
    let Prisma: DbService;
    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = moduleRef.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
            }),
        );
        await app.init();
        await app.listen(3333);
        Prisma = app.get(DbService);
        await Prisma.cleanDB();
        pactum.request.setBaseUrl('http://localhost:3333');
    });
    afterAll(() => {});

    describe('Auth', () => {
        describe('SignUp', () => {
            const signupUrl = '/auth/signup';

            it('Should SignUp successfully', () => {
                const dto: SignUpDTO = {
                    email: 'messi@gmail.com',
                    password: '123',
                    name: 'Prashant',
                    lastName: 'Patil',
                };
                return pactum
                    .spec()
                    .post(signupUrl)
                    .withBody(dto)
                    .expectStatus(201);
            });

            it('Should throw error if email is missing', () => {
                const dto = {
                    password: '123',
                    name: 'Prashant',
                    lastName: 'Patil',
                };
                return pactum
                    .spec()
                    .post(signupUrl)
                    .withBody(dto)
                    .expectStatus(400);
            });

            it('Should throw error if password is missing', () => {
                const dto = {
                    email: 'messi@gmail.com',
                    name: 'Prashant',
                    lastName: 'Patil',
                };
                return pactum
                    .spec()
                    .post(signupUrl)
                    .withBody(dto)
                    .expectStatus(400);
            });

            it('Should throw error if email format is invalid', () => {
                const dto = {
                    email: 'messi.gmail.com',
                    password: '123',
                    name: 'Prashant',
                    lastName: 'Patil',
                };
                return pactum
                    .spec()
                    .post(signupUrl)
                    .withBody(dto)
                    .expectStatus(400);
            });
        });

        describe('SignIn', () => {
            const signinUrl = '/auth/signin';

            it('Should Signin successfully', () => {
                const dto: SignInDTO = {
                    email: 'messi@gmail.com',
                    password: '123',
                };
                return pactum
                    .spec()
                    .post(signinUrl)
                    .withBody(dto)
                    .expectStatus(201)
                    .stores('userAt', 'AccessTokken');
            });

            it('Should throw error if email is missing', () => {
                const dto = {
                    password: '123',
                };
                return pactum
                    .spec()
                    .post(signinUrl)
                    .withBody(dto)
                    .expectStatus(400);
            });

            it('Should throw error if password is missing', () => {
                const dto = {
                    email: 'messi@gmail.com',
                };
                return pactum
                    .spec()
                    .post(signinUrl)
                    .withBody(dto)
                    .expectStatus(400);
            });

            it('Should throw error if email format is invalid', () => {
                const dto = {
                    email: 'messi.gmail.com',
                    password: '123',
                };
                return pactum
                    .spec()
                    .post(signinUrl)
                    .withBody(dto)
                    .expectStatus(400);
            });
        });
    });

    describe('User', () => {
        it('Get User', () => {
            return pactum
                .spec()
                .get('/users')
                .withBearerToken('$S{userAt}')
                .expectStatus(200)
                .inspect();
        });
        const editUserUrl = '/users/editUser';

        it('Should edit user successfully when providing all fields', () => {
            const dto = {
                email: 'newemail@gmail.com',
                name: 'NewName',
                lastName: 'NewLastName',
            };

            return pactum
                .spec()
                .patch(editUserUrl)
                .withBearerToken('$S{userAt}')
                .withBody(dto)
                .expectStatus(200)
                .expectBodyContains('The User Edited Sucessfully')
                .expectBodyContains('newemail@gmail.com')
                .expectBodyContains('NewName')
                .expectBodyContains('NewLastName');
        });
        it('Should Edit only one given field', () => {
            const dto = {
                name: 'Leonel',
            };
            return pactum
                .spec()
                .patch(editUserUrl)
                .withBearerToken('$S{userAt}')
                .withBody(dto)
                .expectStatus(200);
        });
    });

    describe('Bookmarks', () => {
        describe('Create bookmark', () => {});
        describe('get bookmark', () => {});
        describe('get bookmark by id', () => {});
        describe('edit bookmark', () => {});
    });
});
