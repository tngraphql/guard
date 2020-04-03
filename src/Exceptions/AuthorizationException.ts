/**
 * Created by Phan Trung Nguyên.
 * User: nguyenpl117
 * Date: 3/29/2020
 * Time: 9:04 PM
 */

import {Exception} from '@poppinss/utils/build'

export class AuthorizationException extends Exception {
    constructor(message = 'Unauthorized.') {
        super(message, 401, 'E_UNAUTHORIZED');
    }
}
