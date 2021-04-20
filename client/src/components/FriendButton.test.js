import FriendButton from "./FriendButton";
import { render, fireEvent } from "@testing-library/react";

test("call the onClick-method when the button is clicked", () => {
    const onClickHander = jest.fn();
    const { container } = render(
        <FriendButton onButtonClick={onClickHander} />
    );

    fireEvent.click(container.querySelector("button"));
    expect(onClickHander).toHaveBeenCalled();
});

//der Test hat nicht funktioniert, weil axios call
