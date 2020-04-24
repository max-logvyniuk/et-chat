import isEmpty from 'lodash/isEmpty';

import UserService from '../services/UserService';
import MessageService from '../services/MessageService';
import Util from '../utils/Utils';

const util = new Util();

class UserController {

    static async getAllUsers(request, response) {
        try {
            const allUsers = await UserService.getAllUsers();
            // console.info('All users ---', allUsers);
            if (allUsers.length > 0) {
                util.setSuccess(200, 'Users retrieved', allUsers);
            } else {
                util.setSuccess(200, 'No messages found');
            }
          return util.send(response);
        } catch (error) {
          console.log(error);
            util.setError(400, error);
            return util.send(response);
        }
    };

    static async addUser(request, response) {

        console.info('In new user data', request.body);
        if (
          !request.body.id &&
          isEmpty(request.body.fullname)
        ) {
            util.setError(400, 'Please provide complete details');
            return util.send(response);
        }

        const newUser = request.body;

        try {
            const createdUser = await UserService.addUser(newUser);
            util.setSuccess(201, 'User Added!', createdUser);
            // console.info('New user', createdUser);

            return util.send(response);

        } catch (error) {
          console.info(error);
            util.setError(400, error.message);
            return util.send(response);
        }
    };

    static async updatedUser(request, response) {
        const alteredUser = request.body;
        const { id } = request.params;

        if (!Number(id)) {
            util.setError(400, 'Please input a valid data');
            return util.send(response);
        }
        try {
            const updateUser = await UserService.updateUser(id, alteredUser);
            if (!updateUser) {
                util.setError(404, `Cannot find test with the id: ${id}`);
            } else {
                util.setSuccess(200, 'User updated', updateUser);
            }
            return util.send(response);
        } catch (error) {
            util.setError(404, error);
            return util.send(response);
        }
    };

    static async getUserById(request, response) {

        const { id } = request.params;

        if (!Number(id)) {
            util.setError(400, 'Please input a valid numeric value');
            return util.send(response);
        }

        try {
            const theUser = await UserService.getAUser(id);

            if (!theUser) {
                util.setError(404, `Cannot find test with the id ${id}`);
            } else {
                util.setSuccess(200, 'Found User', theUser);
            }
            return util.send(response);
        } catch (error) {
            util.setError(404, error);
            return util.send(response);
        }
    };

    static async deleteUser(request, response) {
        const { id } = request.params;

        if (!Number(id)) {
            util.setError(400, 'Please provide a numeric value');
            return util.send(response);
        }

        try {
            await MessageService.deleteAllUserMessages(id);
            const userToDelete = await UserService.deleteUser(id);
            if (userToDelete) {
                util.setSuccess(200, 'User deleted');
            } else {
                util.setError(404, `User with the id ${id} cannot be found`);
            }
            return util.send(response);
        } catch (error) {
            util.setError(400, error);
            return util.send(response);
        }
    }
}


export default UserController;
