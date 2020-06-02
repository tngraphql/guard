/**
 * Created by Phan Trung Nguyên.
 * User: nguyenpl117
 * Date: 3/29/2020
 * Time: 10:09 PM
 */

import {Application, ConsoleKernel} from "@tngraphql/illuminate";
import {MakePolicyCommand} from "../src/Command/MakePolicyCommand";
import {join} from "path";
import {Filesystem} from "@poppinss/dev-utils/build";

const fs = new Filesystem(join(__dirname, 'app'));

describe('Make Policy', () => {
    afterEach(async () => {
        await fs.cleanup();
    });

    it('should generate file policy', async () => {
        const app = new Application(fs.basePath);
        app.environment = 'test';
        const kernel = new ConsoleKernel(app);
        await kernel.handle();
        const cmd = new MakePolicyCommand(app, kernel.getAce());
        cmd.name = 'postpolicy';
        // cmd.force = true;

        await cmd.handle();

        expect(cmd.logger.logs[0].startsWith('underline(green(create))')).toBe(true);
    });

    it('test format name', async () => {
        const app = new Application(fs.basePath);
        app.environment = 'test';
        const kernel = new ConsoleKernel(app);
        await kernel.handle();
        const cmd = new MakePolicyCommand(app, kernel.getAce());
        cmd.name = 'post';
        expect(cmd.getFileName('post')).toBe('post');
        expect(cmd.getFileName('postpolicy')).toBe('PostPolicy');
        expect(cmd.getFileName('postpolicys')).toBe('postpolicys');
        expect(cmd.getFileName('postspolicy')).toBe('PostPolicy');
    });

    it('should not generate file policy when file already exists', async () => {
        const app = new Application(fs.basePath);
        app.environment = 'test';
        const kernel = new ConsoleKernel(app);
        await kernel.handle();
        const cmd = new MakePolicyCommand(app, kernel.getAce());
        cmd.name = 'postpolicy';

        await cmd.handle();
        await cmd.handle();

        expect(cmd.logger.logs[1].startsWith('underline(magenta(skip))')).toBe(true);
    });

    it('should generate file policy when file already exists using --force', async () => {
        const app = new Application(fs.basePath);
        app.environment = 'test';

        const kernel = new ConsoleKernel(app);
        await kernel.handle();
        kernel.registerCommand([MakePolicyCommand]);
        const cmd = new MakePolicyCommand(app, kernel.getAce());
        cmd.name = 'postpolicy';
        cmd.force = true;

        await kernel.call('make:policy', ['postpolicy', '--force'])
        await cmd.handle();

        expect(cmd.logger.logs[0].startsWith('underline(green(create))')).toBe(true);
    });

});
