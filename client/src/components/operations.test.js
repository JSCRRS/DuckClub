const { sum, minus } = require("./operations");

test("sum() - default behaviour", () => {
    const functionResult = sum(2, 3);
    const expectedResult = 5;
    expect(functionResult).toBe(expectedResult);
});

test("minus() - default behaviour", () => {
    const functionResult = minus(5, 1);
    const expectedResult = 4;
    expect(functionResult).toBe(expectedResult);
});
