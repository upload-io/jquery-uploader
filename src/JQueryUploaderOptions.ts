import { UploaderResult } from "uploader";
import { JQueryUploaderDropzoneOptions } from "@upload-io/jquery-uploader/JQueryUploaderDropzoneOptions";

export interface JQueryUploaderOptions {
  dropzone?: true | JQueryUploaderDropzoneOptions;
  onComplete?: (files: UploaderResult[]) => void;
}
