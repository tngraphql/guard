/**
 * Created by Phan Trung Nguyên.
 * User: nguyenpl117
 * Date: 3/29/2020
 * Time: 9:34 PM
 */
import {GeneratorCommand} from "@tngraphql/illuminate/dist/Foundation";
import * as path from "path";
import {args, flags} from "@tngraphql/console";
const _ = require('lodash')
const { singular } = require('pluralize')

export class MakePolicyCommand extends GeneratorCommand {
    /**
     * Command name. The command will be registered using this name only. Make
     * sure their aren't any spaces inside the command name.
     */
    static commandName: string = 'make:policy';

    static description: string = 'Make a new Policy';

    @flags.boolean({description: 'Overwrite keys they already exist'})
    public force: boolean;

    @args.string()
    public name: string

    protected getStub(): string {
        return path.join(__dirname, 'stub/policy.stub');
    }

    protected getSuffix(): string {
        return "";
    }

    getFileName(name) {
        if (!/policy$/ig.test(name)) {
            return name;
        }

        name = name.replace(/policy/ig, '');

        return `${singular(_.upperFirst(_.camelCase(name)))}Policy`;
    }

    getResourceName(name) {
        return this.getFileName(name).replace('Policy', '').toLowerCase();
    }

    async handle(): Promise<boolean> {

        this.name = this.getFileName(this.name);

        await this.generateFile(this.getDestinationPath(), {
            name: this.name,
            resource: this.getResourceName(this.name),
        }, this.fileOptions());

        return true;
    }

    getDestinationPath() {
        return path.join(this.application.basePath(), 'app/GraphQL/Policies');
    }
}
