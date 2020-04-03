/**
 * Created by Phan Trung Nguyên.
 * User: nguyenpl117
 * Date: 3/29/2020
 * Time: 8:08 PM
 */

import {Gate, Guard} from "@slynova/fence";
import {Storage} from "@slynova/fence/dist/Storage";
import {Application} from "tn-illuminate";
import {GuardServiceProvider} from "../src/GuardServiceProvider";

const storage = Storage.instance;

describe('Unit', () => {

    it('it should be able to define policy', async () => {
        const app = new Application(__dirname);
        await app.register(new GuardServiceProvider(app));

        class UserModel {
            public id = 1;
            public name = 'nguyen';
            _className = 'userModel';
        }

        class UserPolicy {
            create(user, resource) {
                return user.id === resource.id;
            }
        }

        app.bind('App/Models/UserModel', () => {
            return UserModel;
        })

        Gate.policy('App/Models/UserModel', UserPolicy);

        const guard = Guard.setDefaultUser({id: 1});

        expect(guard.allows('create', new UserModel(), undefined)).toBeTruthy();
    });
});
