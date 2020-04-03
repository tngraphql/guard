/**
 * Created by Phan Trung Nguyên.
 * User: nguyenpl117
 * Date: 3/30/2020
 * Time: 7:51 PM
 */
import {Gate as BaseGate, Guard as BaseGuard} from "@slynova/fence";

export const Gate: typeof BaseGate = BaseGate;
export const Guard: typeof BaseGuard = BaseGuard;
export * from './GuardServiceProvider';
export * from './Middleware/CanMiddleware';
export * from './Exceptions/AuthorizationException';
export * from './Command/MakePolicyCommand';
