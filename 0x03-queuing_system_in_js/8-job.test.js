import { createQueue } from 'kue';
import { expect } from 'chai';
import sinon from 'sinon';
import createPushNotificationsJobs from './8-job.js';

describe('createPushNotificationsJobs', () => {
    const spy = sinon.spy(console, 'log');
    const queue = createQueue({ name: 'push_notification_code_test' });

    before(() => {
        queue.testMode.enter(true);
    });
    after(() => {
        queue.testMode.clear();
        queue.testMode.exit();
    });
    afterEach(() => {
        spy.log.resetHistory();
    });

    it('add jobs', () => {
        const list = [
            {
                phoneNumber: '4153518780',
                message: 'This is the code 1234 to verify your account',
            },
            {
                phoneNumber: '4153518781',
                message: 'This is the code 1235 to verify your account',
            },
            {
                phoneNumber: '4153518782',
                message: 'This is the code 1236 to verify your account',
            },
            {
                phoneNumber: '4153518783',
                message: 'This is the code 1237 to verify your account',
            },
        ];
        expect(queue.testMode.jobs.length).to.equal(0);
        createPushNotificationsJobs(list, queue);
        expect(queue.testMode.jobs.length).to.equal(4);
        expect(queue.testMode.jobs[0].type).to.equal('push_notification_code_3');
        queue.process('push_notification_code_3', (job, done) => {
            expect(spy.log.calledWith(`Sending notification to ${list[0].phoneNumber}, \
                with message: ${list[0].message}`)).to.be.true;
            done();
        });
        it('displays an error message if jobs is not an array', () => {
            expect(createPushNotificationsJobs.bind(
                createPushNotificationsJobs, 'not an array', queue))
                .to.throw('Jobs is not an array');
            });

        it('displays an error message if jobs is an empty array', () => {
            expect(createPushNotificationsJobs.bind(
                createPushNotificationsJobs, [], queue))
                .to.throw('Jobs is empty');
            });
        it('registers a progress', (done) => {
            queue.testMode.jobs[0].addListener('progress', (progress) => {
                expect(spy
                    .calledWith(`Notification job 1 is 50% complete`)).to.be.true;
                done();
            });
            queue.testMode.jobs[0].emit('progress', 50);
        });
        it('registers a completion', (done) => {
            queue.testMode.jobs[0].addListener('complete', () => {
                expect(spy.calledWith(`Notification job 1 completed`)).to.be.true;
                done();
            });
            queue.testMode.jobs[0].emit('complete');
        });
    });
});