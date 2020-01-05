import * as path from "path";
import { Loader } from "../src/loader";

test("Should load with name", () => {
  const loader = new Loader(path.resolve(__dirname, "../fixture-tests/"));
  const object: any = loader.load();
  expect(Object.keys(object.aaa).length === 0).toBeTruthy();
  expect(Object.keys(object.bbb).length === 0).toBeTruthy();
  expect(object.css.default.css === 1111).toBeTruthy();
  expect(object.ddd.json === "Hello world").toBeTruthy();
});

test("Should load with nameless", () => {
  const loader = new Loader(path.resolve(__dirname, "../fixture-tests/"), true);
  const object: any = loader.load();
  expect(object).toMatchObject({ default: { css: 1111 }, json: "Hello world" });
});

test("Should load with nameless", () => {
  const loader = new Loader("../fixture-tests/", true);
  const object: any = loader.load();
  expect(object).toMatchObject({ default: { css: 1111 }, json: "Hello world" });
});

test("Should not load with wrong path", () => {
  let catched = false;
  try {
    const loader = new Loader("./fixture-tests/", true);
    loader.load();
  } catch (e) {
    expect(e.message === "Not such directory!").toBeTruthy();
    catched = true;
  }
  expect(catched).toBeTruthy();
});

test("Should not load with wrong path", () => {
  let catched = false;
  try {
    const loader = new Loader("/fixture-tests/", true);
    loader.load();
  } catch (e) {
    expect(e.message === "Not such directory!").toBeTruthy();
    catched = true;
  }
  expect(catched).toBeTruthy();
});
