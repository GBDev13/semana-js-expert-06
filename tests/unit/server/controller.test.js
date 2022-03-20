import { jest, expect, describe, test, beforeEach } from "@jest/globals";
import { Controller } from "../../../server/controller.js";
import { Service } from "../../../server/service.js";
import TestUtil from "../_util/testUtil.js";

describe("#Controller - test suite for controller", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("should get file stream", async () => {
    const fileType = ".html";
    const fileName = `index${fileType}`;
    const mockFileStream = TestUtil.generateReadableStream(["data"]);

    jest
      .spyOn(Service.prototype, Service.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockFileStream,
        type: fileType,
      });

    const controller = new Controller();
    const { stream, type } = await controller.getFileStream(fileName);

    expect(stream).toStrictEqual(mockFileStream);
    expect(type).toStrictEqual(fileType);
  });
});
