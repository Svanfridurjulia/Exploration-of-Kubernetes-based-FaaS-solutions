import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { UserButton } from './UserButton';
import { BrowserRouter as Router } from 'react-router-dom';

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

    test('should show the dropdown when the user button is clicked', () => {
        render(
            <Router basename="">
                <UserButton option1="Profile" link1="/profile" option2="Log out" link2="/logout" />
            </Router>
        );
        const { getByTestId } = render(<UserButton />);
        const profileButton = getByTestId('Profile').querySelector('[data-testid="profileButton"]')
        fireEvent.click(profileButton);
        const dropdown = getByTestId('dropdownDiv');
        expect(dropdown).toBeInTheDocument();
    });

    //   test('should hide the dropdown when the user button is clicked again', () => {
    //     render(
    //         <Router basename="">
    //           <UserButton option1="Profile" link1="/profile" option2="Log out" link2="/logout" />
    //         </Router>
    //       );
    //     const { getByTestId, queryByTestId } = render(<UserButton />);
    //     const userButton = queryByTestId('profileButton');
    //     fireEvent.click(userButton);
    //     let dropdown = getByTestId('dropdownDiv');
    //     expect(dropdown).toBeInTheDocument();
    //     fireEvent.click(userButton);
    //     dropdown = queryByTestId('dropdownDiv');
    //     expect(dropdown).toBeNull();
    //   });

    //   test('should show the first option in the dropdown', () => {
    //     const { getByTestId } = render(
    //       <UserButton option1="Option 1" link1="/" option2="Option 2" link2="/dashboard" />
    //     );
    //     const userButton = getByTestId('userButton');
    //     fireEvent.click(userButton);
    //     const dropButton1 = getByTestId('dropButton1');
    //     expect(dropButton1).toHaveTextContent('Option 1');
    //   });

    //   test('should show the second option in the dropdown', () => {
    //     const { getByTestId } = render(
    //       <UserButton option1="Option 1" link1="/" option2="Option 2" link2="/dashboard" />
    //     );
    //     const userButton = getByTestId('userButton');
    //     fireEvent.click(userButton);
    //     const dropButton2 = getByTestId('dropButton2');
    //     expect(dropButton2).toHaveTextContent('Option 2');
    //   });

    //   test('should link to the correct URL for the first option', () => {
    //     const { getByTestId } = render(
    //       <UserButton option1="Option 1" link1="/" option2="Option 2" link2="/dashboard" />
    //     );
    //     const userButton = getByTestId('userButton');
    //     fireEvent.click(userButton);
    //     const dropButton1 = getByTestId('dropButton1');
    //     expect(dropButton1).toHaveAttribute('href', '/');
    //   });

    //   test('should link to the correct URL for the second option', () => {
    //     const { getByTestId } = render(
    //       <UserButton option1="Option 1" link1="/" option2="Option 2" link2="/dashboard" />
    //     );
    //     const userButton = getByTestId('userButton');
    //     fireEvent.click(userButton);
    //     const dropButton2 = getByTestId('dropButton2');
    //     expect(dropButton2).toHaveAttribute('href', '/dashboard');
    //   });
});
