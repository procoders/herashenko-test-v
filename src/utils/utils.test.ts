import { promiseEach } from './promiseeach';
import { monthToDate } from './monthToDate';

export default () =>
  describe('testing utils', () => {
    describe('testing monthToDate function', () => {
      test('should return string depends in boolean', () => {
            const result = monthToDate(10);
            
            expect(result).toBeInstanceOf(Date);
      });
    });
    describe('testing promiseEach function', () => {
      test('should call function array.length times', async () => {
        const mockarray = [1, 2, 3, 4];
        const mockCallback = jest.fn((elem: any) => elem);

        await promiseEach(mockarray, mockCallback);

        expect(mockCallback.mock.calls.length).toBe(mockarray.length);
        expect(mockCallback.mock.calls[0][0]).toBe(mockarray[0]);
      });
    });
  });
