import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { UserButton } from './UserButton';
import { Link, BrowserRouter as Router } from 'react-router-dom';

describe('UserButton', () => {
    test('should render the user button', () => {
        const { getByTestId } = render(<UserButton />);
        const profileButton = getByTestId('profileButton');
        expect(profileButton).toBeInTheDocument();
    });

    test('should not show the dropdown by default', () => {
        const { queryByTestId } = render(<UserButton />);
        const dropdown = queryByTestId('dropdownDiv');
        expect(dropdown).toBeNull();
    });

    test('dropdown displayed when the profile button is clicked', () => {
        render(
            <Router basename="">
                <UserButton option1="Profile" link1="/profile" option2="Log out" link2="/" />
            </Router>
        );
        const { getByTestId } = render(<UserButton />);
        const profileButton = getByTestId('Profile').querySelector('[data-testid="profileButton"]')
        fireEvent.click(profileButton);
        const dropdown = getByTestId('dropdownDiv');
        expect(dropdown).toBeInTheDocument();
    });

    test('dropdown hidden when the profile button is clicked again', () => {
        render(
            <Router basename="">
                <UserButton option1="Profile" link1="/profile" option2="Log out" link2="/" />
            </Router>
        );
        const { getByTestId, queryByTestId } = render(<UserButton />);
        const userButton = getByTestId('Profile').querySelector('[data-testid="profileButton"]')
        fireEvent.click(userButton);
        let dropdown = getByTestId('dropdownDiv');
        expect(dropdown).toBeInTheDocument();
        fireEvent.click(userButton);
        dropdown = queryByTestId('dropdownDiv');
        expect(dropdown).toBeNull();
    });

    test('Dropdown shows option1', () => {
        render(
            <Router basename="">
                <UserButton option1="Dashboard" link1="/dashboard" option2="Log out" link2="/" />
            </Router>
        );
        const { getByTestId } = render(<UserButton />);
        const userButton = getByTestId('Dashboard').querySelector('[data-testid="profileButton"]')
        fireEvent.click(userButton);
        const dropButton1 = getByTestId('dropButton1');
        expect(dropButton1).toHaveTextContent('Dashboard');
    });

    test('Dropdown shows option2', () => {
        render(
            <Router basename="">
                <UserButton option1="Dashboard" link1="/dashboard" option2="Log out" link2="/" />
            </Router>
        );
        const { getByTestId } = render(<UserButton />);
        const userButton = getByTestId('Dashboard').querySelector('[data-testid="profileButton"]')
        fireEvent.click(userButton);
        const dropButton2 = getByTestId('dropButton2');
        expect(dropButton2).toHaveTextContent('Log out');
    });
});
