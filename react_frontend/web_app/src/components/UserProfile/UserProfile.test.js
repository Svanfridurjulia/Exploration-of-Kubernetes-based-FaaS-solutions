import { render, screen } from '@testing-library/react';
import { getAllUserPostItems } from '../../services/postService';
import { getCurrentUser } from '../../services/userService';
import { UserProfile } from './UserProfile';

jest.mock('../../services/postService');
jest.mock('../../services/userService');

describe('UserProfile', () => {
    beforeEach(() => {
        getAllUserPostItems.mockReturnValue([]);
        getCurrentUser.mockReturnValue('Gunnar');
        render(<UserProfile />);
    });

    test('render the banner', () => {
        const bannerTopic = screen.getByText('My Posts');
        expect(bannerTopic).toBeInTheDocument();
    });

    test('Fetches posts for current user', () => {
        expect(getAllUserPostItems).toHaveBeenCalledWith('Gunnar');
    });
});
