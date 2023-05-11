import { render, screen } from '@testing-library/react';
import { Posts } from './Posts';


test('renders nothing when there are no posts', () => {
  const posts = [];
  render(<Posts posts={posts} />);
  const postItems = screen.queryAllByTestId('postItem');
  expect(postItems).toHaveLength(0);
});
