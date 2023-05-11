import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LogIn } from './LogIn';
import { authenticationNodeFunction } from '../../services/FunctionServices';
import { setCurrentUser } from '../../services/userService';

jest.mock('../../services/FunctionServices');
jest.mock('../../services/userService');
jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn(),
}));

describe('LogIn', () => {
    beforeEach(() => {
        authenticationNodeFunction.mockClear();
        setCurrentUser.mockClear();
    });

    test('render the LogIn component', () => {
        render(<LogIn />);
    });

    test('Check the page title', () => {
        render(<LogIn />);
        const pageTitle = screen.getByTestId('pageTitle');
        expect(pageTitle).toHaveTextContent('Log In');
    });


    test('Sends the correct information to authenticationNodeFunction', async () => {
        const response = {
            statusCode: 200,
        };
        authenticationNodeFunction.mockResolvedValue(response);
        render(<LogIn />);

        fireEvent.change(screen.getByTestId('usernameInput'), {
            target: { value: 'testuser' },
        });
        fireEvent.change(screen.getByTestId('passwordInput'), {
            target: { value: 'testpassword' },
        });
        fireEvent.submit(screen.getByTestId('form'));
        
        await waitFor(() =>
            expect(authenticationNodeFunction).toHaveBeenCalledWith({
                username: 'testuser',
                password: 'testpassword',
            })
        );
    });
      
});
