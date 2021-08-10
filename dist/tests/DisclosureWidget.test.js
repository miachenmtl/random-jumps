import { fireEvent, render, screen } from "@testing-library/react";
import DisclosureWidget from "../components/DisclosureWidget";
describe('The DisclosureWidget component', () => {
  it('can render children', () => {
    render( /*#__PURE__*/React.createElement(DisclosureWidget, null, /*#__PURE__*/React.createElement("div", null, "foo")));
    expect(screen.getByText('foo')).toBeInTheDocument();
  });
  it('can reveal and hide content', () => {
    render( /*#__PURE__*/React.createElement(DisclosureWidget, {
      buttonText: "Show"
    }, /*#__PURE__*/React.createElement("div", null, "foo"))); // against the spirit of rtl, but getting jest to understand global css is problematic...

    const contentContainer = screen.getByText('foo').parentElement;
    expect(contentContainer.getAttribute('class')).not.toContain('open');
    fireEvent.click(screen.getByText('Show'));
    expect(contentContainer.getAttribute('class')).toContain('open');
    fireEvent.click(screen.getByText('Show'));
    expect(contentContainer.getAttribute('class')).not.toContain('open');
  });
});