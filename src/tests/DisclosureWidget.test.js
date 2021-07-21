import { fireEvent, render, screen } from "@testing-library/react";
import DisclosureWidget from "../components/DisclosureWidget";

describe('The DisclosureWidget component', () => {
  it('can render children', () => {
    render(
      <DisclosureWidget>
        <div>foo</div>
      </DisclosureWidget>
    );
    expect(screen.getByText('foo')).toBeInTheDocument();
  });

  it('can reveal and hide content', () => {
    render(
      <DisclosureWidget buttonText="Show">
        <div>foo</div>
      </DisclosureWidget>
    );

    // against the spirit of rtl, but getting jest to understand global css is problematic...
    const contentContainer = screen.getByText('foo').parentElement;

    expect(contentContainer.getAttribute('class')).not.toContain('open');
    fireEvent.click(screen.getByText('Show'));
    expect(contentContainer.getAttribute('class')).toContain('open');
    fireEvent.click(screen.getByText('Show'));
    expect(contentContainer.getAttribute('class')).not.toContain('open');
  });
});
