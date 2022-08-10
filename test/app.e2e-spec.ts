import {
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AuthDto } from 'src/auth/dto';
import { CreateBookmarkDto } from 'src/bookmark/dto/create-bookmark.dto';
import { EditBookmarkDto } from 'src/bookmark/dto/edit-bookmark.dto';
import { AppModule } from '../src/app.module';

function makeid(length) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(
      Math.floor(
        Math.random() * charactersLength,
      ),
    );
  }
  return result;
}

describe('App 2e2', () => {
  let app: INestApplication;
  const email = `${makeid(10)}@${makeid(
      5,
    )}.${makeid(3)}`,
    password = 'dontwatchme';
  beforeAll(async () => {
    const moduleRef =
      await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    pactum.request.setBaseUrl(
      'http://localhost:3000',
    );
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    describe('Signup', () => {
      console.log({ email });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: '',
            email,
          })
          .expectStatus(400);
      });
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email: '',
            password,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .expectStatus(400);
      });
      it('should signup', () => {
        const dto: AuthDto = {
          email,
          password,
        };
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe('Signin', () => {
      describe('should signin', () => {
        it('should throw if password empty', () => {
          return pactum
            .spec()
            .post('/auth/signin')
            .withBody({
              password: '',
              email,
            })
            .expectStatus(400);
        });
        it('should throw if email empty', () => {
          return pactum
            .spec()
            .post('/auth/signin')
            .withBody({
              email: '',
              password,
            })
            .expectStatus(400);
        });
        it('should throw if no body provided', () => {
          return pactum
            .spec()
            .post('/auth/signin')
            .expectStatus(400);
        });
        it('should signin', () => {
          const dto: AuthDto = {
            email,
            password,
          };
          return pactum
            .spec()
            .post('/auth/signin')
            .withBody(dto)
            .expectStatus(200)
            .stores('userAt', 'access_token');
        });
      });
    });

    describe('User', () => {
      describe('Get me', () => {
        it('should get current user', () => {
          return pactum
            .spec()
            .get('/users/me')
            .withHeaders({
              Authorization: 'Bearer $S{userAt}',
            })
            .expectStatus(200)
            .inspect();
        });
      });
    });
  });

  describe('Bookmarks', () => {
    describe('Get empty bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBody([]);
      });
    });

    describe('Create bookmark', () => {
      const dto: CreateBookmarkDto = {
        title:
          'Frank Yupanqui Allcca Youtube channel',
        link: 'https://www.youtube.com/channel/UCWAAUV5pt7h-tXimIXF_7KQ',
      };
      it('should create bookmark', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkId', 'id');
      });
    });

    describe('Get bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Get bookmark by id', () => {
      it('should get bookmark by id', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}');
      });
    });

    describe('Edit bookmark by id', () => {
      const dto: EditBookmarkDto = {
        title: 'Frank Yupanqui Allcca LinkedIn',
        link: 'https://www.linkedin.com/in/fyupanquia',
      };
      it('should edit bookmark', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.link);
      });
    });

    describe('Delete bookmark by id', () => {
      it('should delete bookmark', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204);
      });
    });
  });

  it.todo('should test!');
  it.todo('should test 2!');
});
