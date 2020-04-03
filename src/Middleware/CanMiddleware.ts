/**
 * Created by Phan Trung Nguyên.
 * User: nguyenpl117
 * Date: 3/29/2020
 * Time: 8:47 PM
 */
import {ResolverData} from "@tngraphql/graphql";
import {AuthorizationException} from "../Exceptions/AuthorizationException";

export class CanMiddleware {
    public async handle (
        data: ResolverData<any>,
        next: () => Promise<void>,
        [method, ...argument]: string[],
    ) {
        const {auth, guard} = data.context;

        if (!await guard.allows(method, argument, await auth.user())) {
            throw new AuthorizationException('Unauthorized.');
        }

        await next();
    }
}
