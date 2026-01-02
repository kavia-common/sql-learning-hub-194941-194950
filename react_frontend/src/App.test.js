import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders SQLMaster header", () => {
  render(<App />);
  const title = screen.getByText(/SQLMaster/i);
  expect(title).toBeInTheDocument();
});
