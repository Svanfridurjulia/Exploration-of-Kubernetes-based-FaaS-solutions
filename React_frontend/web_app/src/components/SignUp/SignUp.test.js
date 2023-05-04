import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { SignUp } from '../SignUp/SignUp';
import { setCurrentUser } from '../../services/userService';
import { passwordGoFunction, writeUserPythonFunction, sendEmailGoFunction } from '../../services/FunctionServices';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
    useNavigate: () => jest.fn(),
}));

// Mock the setCurrentUser function
jest.mock('../../services/userService', () => ({
    setCurrentUser: jest.fn(),
}));

// Mock the passwordGoFunction function
jest.mock('../../services/FunctionServices', () => ({
    passwordGoFunction: jest.fn(() => Promise.resolve('newPassword')),
    writeUserPythonFunction: jest.fn(() => Promise.resolve({ success: true })),
    sendEmailGoFunction: jest.fn(),
}));

describe('SignUp component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('render the SignUp component', () => {
        render(<SignUp />);
        expect(screen.getByTestId('pageTitle')).toBeInTheDocument();
        expect(screen.getByTestId('backButton')).toBeInTheDocument();
        expect(screen.getByTestId('signupForm')).toBeInTheDocument();
        expect(screen.getByLabelText('Name:')).toBeInTheDocument();
        expect(screen.getByLabelText('Username:')).toBeInTheDocument();
        expect(screen.getByLabelText('Password:')).toBeInTheDocument();
        expect(screen.getByTestId('diceButton')).toBeInTheDocument();
        expect(screen.getByTestId('subButton')).toBeInTheDocument();
    });

    test('Back button is clicked', () => {
        const navigate = jest.fn();
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate);
        render(<SignUp />);
        fireEvent.click(screen.getByTestId('backButton'));
        expect(navigate).toHaveBeenCalled();
    });

    test('Navigate to dashboard when the form is submitted', async () => {
        const navigate = jest.fn();
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(navigate);
        render(<SignUp />);
        fireEvent.change(screen.getByTestId('nameInput'), {
            target: { value: 'Test User' },
        });
        fireEvent.change(screen.getByTestId('usernameInput'), {
            target: { value: 'testuser' },
        });
        fireEvent.change(screen.getByTestId('passwordInput'), {
            target: { value: 'password' },
        });
        fireEvent.submit(screen.getByTestId('signupForm'));
        await waitFor(() => {
            expect(setCurrentUser).toHaveBeenCalledWith('testuser');
            expect(navigate).toHaveBeenCalledWith('/dashboard');
        });
    });
});