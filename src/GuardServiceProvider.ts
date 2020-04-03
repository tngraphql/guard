/**
 * Created by Phan Trung Nguyên.
 * User: nguyenpl117
 * Date: 3/29/2020
 * Time: 7:53 PM
 */
import {ServiceProvider} from "tn-illuminate";
// import {Gate, Guard, Helpers} from "@slynova/fence";
import {Context} from "tn-graphql/dist/resolvers/context";
import {MakePolicyCommand} from "./Command/MakePolicyCommand";
import {Gate, Guard} from "./index";
import {Helpers} from "@slynova/fence";

export class GuardServiceProvider extends ServiceProvider {
    register(): void {
        this.monkeyPath();
        this.initGuard();
        this.registerCommand();
    }

    /**
     * init setting guard
     */
    initGuard() {
        const self = this;
        Context.getter('guard', function () {
            const guard = Guard.setDefaultUser(this.auth.user());

            return guard;
        }, true);
    }

    registerCommand() {
        this.commands([MakePolicyCommand]);
    }

    monkeyPath() {
        Helpers.formatResourceName = (resource) => {
            return (resource as any).$gate.namespace;
        }

        Gate.policy = (resourceName, policyName) => {
            const resource: any = this.app.use(resourceName as string)
            resource.prototype.$gate = {namespace: resourceName}

            const policy: any = this.app.make(policyName as Function) as any;

            (Gate as any).$getStorage().storePolicy(resourceName, policy);
        }

        Guard.prototype.allows = async function (ability, resource, user) {
            const usedUser = (user !== undefined) ? await user : await this.$user;
            resource = await resource;

            try {
                if (this.$correspondsToPolicy(resource)) {
                    return Guard.can(usedUser).callPolicy(ability, resource);
                }
                return Guard.can(usedUser).pass(ability).for(resource);
            } catch (e) {
                return false;
            }
        } as any;
    }
}
