/**
 * Copyright(c) 2019
 * Aex Project
 * @author calidion<calidion@gmail.com>
 */

import * as stack from "callsite";
import * as fs from "fs";
import * as path from "path";
/**
 * Loader for Aex
 */

export class Loader {

  public static parse(step: number = 1) {
    let idx = 0;
    const files = stack();
    for (const site of files) {
      const filename = site.getFileName();
      if (!filename) {
        continue;
      }
      idx++;
      if (idx === step) {
        return path.dirname(site.getFileName());
      }
    }
    return "";
  }
  // Component base directory
  protected dir = "";

  // Stored data from specified directory.
  protected data: any = {};

  // data types:
  // named:       named by filename
  // nameless:    merged by object
  protected nameless = false;

  // Alloed extensions

  protected allowedExts: string[] = [".js", ".ts", ".json"];

  constructor(dir: string, nameless: boolean = false) {
    if (path.isAbsolute(dir)) {
      if (!fs.existsSync(dir)) {
        throw new Error("Not such directory!");
      }
      this.dir = dir;
    } else {
      const parentDir = Loader.parse(3);
      this.dir = path.resolve(parentDir, dir);
      if (!fs.existsSync(this.dir)) {
        throw new Error("Not such directory!");
      }
    }
    this.nameless = nameless;
  }

  public load() {
    let data = {};
    this.dirReader(this.dir, (realDir: string, file: string) => {
      const absPath = path.resolve(realDir, file);

      const parsed = this.parseFile(absPath);
      if (!parsed) {
        return;
      }
      const name = path.basename(parsed.path, path.extname(parsed.path));
      data = this.extends(name, parsed.loaded, data);
    });
    return data;
  }

  protected extends(name: string, json: object, data: any) {
    if (this.nameless) {
      data = { ...data, ...json };
    } else {
      data[name] = json;
    }
    return data;
  }

  protected parseFile(absPath: string) {
    const stat = fs.statSync(absPath);
    // ignore directories
    if (stat && stat.isDirectory()) {
      return false;
    }
    // read from valid extensions only
    if (this.allowedExts.indexOf(path.extname(absPath)) === -1) {
      return false;
    }
    try {
      const loaded = require(absPath);
      return { path: absPath, loaded };
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.error(e);
      return false;
    }
  }

  protected dirReader(dir: string, iterator: any) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      return iterator(dir, file);
    });
    return dir;
  }
}
