import TestService from '../services/TestService';
import Util from '../utils/Utils';

const util = new Util();

class TestController {
    static async getAllTests(req, res) {
        try {
            const allTests = await TestService.getAllTests();
            if (allTests.length > 0) {
                util.setSuccess(200, 'Tests retrieved', allTests);
            } else {
                util.setSuccess(200, 'No test found');
            }
            return util.send(res);
        } catch (error) {
            util.setError(400, error);
            return util.send(res);
        }
    }

    static async addTest(req, res) {
        if (!req.body.title || !req.body.description) {
            util.setError(400, 'Please provide complete details');
            return util.send(res);
        }
        const newTest = req.body;
        try {
            const createdTest = await TestService.addTest(newTest);
            util.setSuccess(201, 'Test Added!', createdTest);
            return util.send(res);
        } catch (error) {
            util.setError(400, error.message);
            return util.send(res);
        }
    }

    static async updatedTest(req, res) {
        const alteredTest = req.body;
        const { id } = req.params;
        if (!Number(id)) {
            util.setError(400, 'Please input a valid numeric value');
            return util.send(res);
        }
        try {
            const updateTest = await TestService.updateTest(id, alteredTest);
            if (!updateTest) {
                util.setError(404, `Cannot find test with the id: ${id}`);
            } else {
                util.setSuccess(200, 'Test updated', updateTest);
            }
            return util.send(res);
        } catch (error) {
            util.setError(404, error);
            return util.send(res);
        }
    }

    static async getATest(req, res) {
        const { id } = req.params;

        if (!Number(id)) {
            util.setError(400, 'Please input a valid numeric value');
            return util.send(res);
        }

        try {
            const theTest = await TestService.getATest(id);

            if (!theTest) {
                util.setError(404, `Cannot find test with the id ${id}`);
            } else {
                util.setSuccess(200, 'Found Test', theTest);
            }
            return util.send(res);
        } catch (error) {
            util.setError(404, error);
            return util.send(res);
        }
    }

    static async deleteTest(req, res) {
        const { id } = req.params;

        if (!Number(id)) {
            util.setError(400, 'Please provide a numeric value');
            return util.send(res);
        }

        try {
            const testToDelete = await TestService.deleteTest(id);

            if (testToDelete) {
                util.setSuccess(200, 'Test deleted');
            } else {
                util.setError(404, `Test with the id ${id} cannot be found`);
            }
            return util.send(res);
        } catch (error) {
            util.setError(400, error);
            return util.send(res);
        }
    }
}

export default TestController;