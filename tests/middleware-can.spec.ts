/**
 * Created by Phan Trung Nguyên.
 * User: nguyenpl117
 * Date: 3/29/2020
 * Time: 10:29 PM
 */

import {Application} from "@tngraphql/illuminate";
import {GuardServiceProvider} from "../src/GuardServiceProvider";
import {Context} from "@tngraphql/graphql/dist/resolvers/context";
import {CanMiddleware} from "../src/Middleware/CanMiddleware";
import {Gate} from "@slynova/fence";
import {AuthorizationException} from "../src/Exceptions/AuthorizationException";

describe('Middleware | Can', () => {
    it('should pass', async () => {
        expect.assertions(1);

        const app = new Application(__dirname);

        await app.register(new GuardServiceProvider(app));
        const context: any = new Context({
            req: {
                headers: {}
            },
            res: {},
            auth: {
                user: () => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(
                                {
                                    id: 1,
                                    roles: ['admin']
                                }
                            );
                        }, 200);
                    })
                }
            }
        });

        (Gate as any).define('hasRole', async (user: any, resource) => {
            for (let role of resource) {
                if (user.roles.includes(role)) {
                    return true;
                }
            }
            return false;
        });

        await new CanMiddleware().handle({context} as any, async () => {
            expect(true).toBeTruthy();
        }, ['hasRole', 'admin']);
    });

    it('should throw error when no pass', async () => {
        expect.assertions(3);

        const app = new Application(__dirname);

        await app.register(new GuardServiceProvider(app));
        const context: any = new Context({
            req: {
                headers: {}
            },
            res: {},
            auth: {
                user: () => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve(
                                {
                                    id: 1,
                                    roles: ['member']
                                }
                            );
                        }, 200);
                    })
                }
            }
        });

        (Gate as any).define('hasRole', async (user: any, resource) => {
            for (let role of resource) {
                if (user.roles.includes(role)) {
                    return true;
                }
            }
            return false;
        });

        try {
            await new CanMiddleware().handle({context} as any, async () => {
            }, ['hasRole', 'admin']);
        } catch (e) {
            expect(e.message).toBe('E_UNAUTHORIZED: Unauthorized.');
            expect(e.code).toBe('E_UNAUTHORIZED');
            expect(e).toBeInstanceOf(AuthorizationException);
        };
    });
});
