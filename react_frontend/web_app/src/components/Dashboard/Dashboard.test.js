import { render, screen, fireEvent } from '@testing-library/react';
import { Dashboard } from './Dashboard';
import { getAllPostItems, addPostItem } from '../../services/postService';
import { getCurrentUser } from '../../services/userService';

jest.mock('../../services/postService');
jest.mock('../../services/userService');
jest.mock('../../services/FunctionServices');

describe('Dashboard', () => {
    beforeEach(() => {
        getAllPostItems.mockReturnValue([
            { user: 'Gunnar', time: '4-5-2023', post: 'Hallo' },
            { user: 'Gunna', time: '3-5-2023', post: 'Heimur' },
        ]);
        getCurrentUser.mockReturnValue('Gunnar');
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    test('render the Dashboard component', () => {
        render(<Dashboard />);
    });

    test('check if the correct banner text is displayed', () => {
        render(<Dashboard />);
        const banner = screen.getByTestId('banner');
        expect(banner).toHaveTextContent('Dashboard');
    });

    test('Post button is clicked', () => {
        const user = 'Gunnar';
        var dateObj = new Date();
        var month = dateObj.getUTCMonth() + 1;
        var day = dateObj.getUTCDate();
        var year = dateObj.getUTCFullYear();
        const currentDate = day + '-' + month + '-' + year;
        const post = 'Hallo';
        getCurrentUser.mockReturnValue(user);

        const { getByText, getByPlaceholderText } = render(<Dashboard />);
        const input = getByPlaceholderText("What's on your mind...");
        fireEvent.change(input, { target: { value: post } });
        fireEvent.click(screen.getByTestId('postButton'));

        expect(addPostItem).toHaveBeenCalledWith({
        user: user,
        time: currentDate,
        post: post,
        });
    });

});