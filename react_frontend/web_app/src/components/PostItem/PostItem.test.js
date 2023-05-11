import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PostItem } from './PostItem';

jest.mock('../../services/FunctionServices');

describe('PostItem component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('render the PostItem component', () => {
        render(<PostItem />);
    });

    test('render the user, time, and post', () => {
        const { getByTestId } = render(
            <PostItem id={1} user="Gunnar" time="2023-05-05" post="Hallo heimur" />
        );
        expect(getByTestId('postedBy')).toHaveTextContent('Gunnar on 2023-05-05');
        expect(getByTestId('postMessage')).toHaveTextContent('Hallo heimur');
    });

    test('Translate button is not clicked', () => {
        const { queryByTestId } = render(
            <PostItem id={1} user="Gunnar" time="2023-05-05" post="Heimur" />
        );
        expect(queryByTestId('translation')).toBeNull();
    });
});
