import { jest, expect, describe, test, beforeEach } from "@jest/globals";
import { Controller } from "../../../server/controller.js";
import { Service } from "../../../server/service.js";
import TestUtil from "../_util/testUtil.js";
import fs from "fs";
import { join, extname } from "path";
import config from "../../../server/config.js";
import fsPromises from "fs/promises";

const {
  dir: { publicDirectory },
} = config;

describe("#Service - test suite for service", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test("should create file stream", async () => {
    const mockReadable = TestUtil.generateReadableStream(["data"]);
    const mockFile = "index.html";

    jest.spyOn(fs, fs.createReadStream.name).mockReturnValue(mockReadable);

    const service = new Service();
    const response = service.createFileStream(mockFile);

    expect(response).toStrictEqual(mockReadable);
    expect(fs.createReadStream).toHaveBeenCalledWith(mockFile);
  });

  test("should get file info", async () => {
    const mockFile = "index.html";

    const fileFullDir = `${publicDirectory}/${mockFile}`;

    jest.spyOn(fsPromises, fsPromises.access.name).mockReturnValue();

    const service = new Service();
    const response = await service.getFileInfo(mockFile);

    expect(response).toStrictEqual({
      type: ".html",
      name: fileFullDir,
    });
  });

  test("should get file stream", async () => {
    const mockReadable = TestUtil.generateReadableStream(["data"]);
    const mockFile = "index.html";
    const fileFullDir = `${publicDirectory}/${mockFile}`;
    const mockFileInfo = {
      type: ".html",
      name: fileFullDir,
    };

    const service = new Service();

    jest.spyOn(service, service.getFileInfo.name).mockReturnValue(mockFileInfo);
    jest
      .spyOn(service, service.createFileStream.name)
      .mockReturnValue(mockReadable);

    const response = await service.getFileStream(mockFile);

    expect(response).toStrictEqual({
      stream: mockReadable,
      type: mockFileInfo.type,
    });
    expect(service.getFileInfo).toHaveBeenCalledWith(mockFile);
    expect(service.createFileStream).toHaveBeenCalledWith(fileFullDir);
  });
});
