import BioEditor from "./BioEditor";
import { render, fireEvent } from "@testing-library/react";

// When no bio is passed to it, an "Add" button is rendered.

test("if there is no bio, button renders 'Add Bio'", () => {
    const buttonText = "Add Bio";
    const { container } = render(<BioEditor />);
    expect(container.querySelector(".addBioButton").innerHTML).toBe(buttonText);
});

test("if there is a bio, button renders 'Edit Bio'", () => {
    const buttonText = "Edit Bio";
    const { container } = render(<BioEditor bio="Hello" />);
    expect(container.querySelector(".editBioButton").innerHTML).toBe(
        buttonText
    );
});

//TEST, Ob TextArea da ist (textarea.length = 1)
