import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { UserButton } from './UserButton';

describe('UserButton', () => {
  test('should render the user button', () => {
    const { getByTestId } = render(<UserButton />);
    const userButton = getByTestId('userButton');
    expect(userButton).toBeInTheDocument();
  });

  test('should not show the dropdown by default', () => {
    const { queryByTestId } = render(<UserButton />);
    const dropdown = queryByTestId('dropdown');
    expect(dropdown).toBeNull();
  });

//   test('should show the dropdown when the user button is clicked', () => {
//     const { getByTestId } = render(<UserButton />);
//     const userButton = getByTestId('userButton');
//     fireEvent.click(userButton);
//     const dropdown = getByTestId('dropdown');
//     expect(dropdown).toBeInTheDocument();
//   });

//   test('should hide the dropdown when the user button is clicked again', () => {
//     const { getByTestId, queryByTestId } = render(<UserButton />);
//     const userButton = getByTestId('userButton');
//     fireEvent.click(userButton);
//     let dropdown = getByTestId('dropdown');
//     expect(dropdown).toBeInTheDocument();
//     fireEvent.click(userButton);
//     dropdown = queryByTestId('dropdown');
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
