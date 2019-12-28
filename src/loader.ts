/**
 * Copyright(c) 2019 
 * Aex Project
 * @author calidion<calidion@gmail.com>
 */

import * as fs from "fs";
import * as path from "path";

/**
 * Loader for Aex
 */

export class Loader {
  // Component base directory
  protected dir = ""

  // Stored data from specified directory.
  protected data: any = {};

  // data types:
  // named:       named by filename
  // nameless:    merged by object
  protected nameless = false;

  // Alloed extensions

  protected allowedExts: string[] = [".js", ".ts", ".json"];

  constructor(dir: string,
    nameless: boolean = false
  ) {
    this.dir = dir;
    this.nameless = nameless;
  }

  public extends(name: string, json: object, data: any) {
    if (this.nameless) {
      data = { ...data, ...json };
    } else {
      data[name] = json;

    }
    return data;
  }

  public parseDir(dir: string) {
    if (fs.existsSync(dir)) {
      return dir;
    }
    return false;
  }

  public parseFile(absPath: string) {
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
    }
    catch (e) {
      console.error(e);
      return false;
    }
  }

  public dirReader(dir: string, iterator: any) {
    const parsed = this.parseDir(dir);
    if (!parsed) {
      return false;
    }
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      return iterator(dir, file);
    });
    return dir;
  }


  public load() {
    let data = {};
    if (this.dirReader(this.dir, (realDir: string, file: string) => {
      const absPath = path.resolve(realDir, file);

      const parsed = this.parseFile(absPath);
      if (!parsed) {
        return;
      }
      const name = path.basename(parsed.path, path.extname(parsed.path))
      data = this.extends(name, parsed.loaded, data);
    })) {
      return data;
    }
    return false;
  }
}
