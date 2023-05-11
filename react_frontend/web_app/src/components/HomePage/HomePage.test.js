import { render, screen, fireEvent } from '@testing-library/react';
import { HomePage } from './HomePage';
import { useNavigate } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

describe('HomePage', () => {
    beforeEach(() => {
        useNavigate.mockClear();
    });

    test('render the HomePage component', () => {
        render(<HomePage />);
    });

    test('Check the page name', () => {
        render(<HomePage />);
        const pageName = screen.getByTestId('pageName');
        expect(pageName).toHaveTextContent('Welcome to Fabulous as a Service!');
    });

    test('Check if navigates correctly with login button', () => {
        const navigate = jest.fn();
        useNavigate.mockReturnValue(navigate);
        render(<HomePage />);
        fireEvent.click(screen.getByTestId('logInButton'));
        expect(navigate).toHaveBeenCalledWith('/login');
    });

    test('calls useNavigate with the correct argument when the Sign Up button is clicked', () => {
        const navigate = jest.fn();
        useNavigate.mockReturnValue(navigate);
        render(<HomePage />);
        fireEvent.click(screen.getByTestId('signInButton'));
        expect(navigate).toHaveBeenCalledWith('/signup');
    });

    test('Check if about text is correct', () => {
        render(<HomePage />);
        const header = screen.getByTestId('header2');
        const paragraph1 = screen.getByTestId('paragraph1');
        const paragraph2 = screen.getByTestId('paragraph2');

        expect(header).toHaveTextContent('About this web application');
        expect(paragraph1).toHaveTextContent(
        'This web application was created as a part of a final project done by three students finishing their Bachelor degrees in Computer Science and Software Engineering.'
        );
        expect(paragraph2).toHaveTextContent(
        'The aim of this project is to explore how Function as a Service can be used on top of Kubernetes.'
        );
    });
});