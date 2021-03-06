import { Uploader, UploaderResult, UploaderOptions } from "uploader";
import { Upload, UploadConfig } from "upload-js";
import { JQueryUploaderOptions } from "@upload-io/jquery-uploader/JQueryUploaderOptions";
import { JQueryUploaderDropzoneOptions } from "@upload-io/jquery-uploader/JQueryUploaderDropzoneOptions";

(function ($) {
  let uploader: Uploader | undefined;

  $.extend({
    uploader: {
      init(uploadOrConfig: UploadConfig | Upload) {
        uploader = new Uploader(uploadOrConfig);
      }
    }
  });

  const useUploader = (callback: (uploader: Uploader) => void): void => {
    if (uploader === undefined) {
      console.error("[jquery-uploader] Initialization required, e.g. $.uploader.init({apiKey: 'free'})");
    } else {
      callback(uploader);
    }
  };

  const funcs: any = $.fn;
  funcs.uploader = function (optionsMaybe?: UploaderOptions & JQueryUploaderOptions) {
    const handleOnComplete = (promise: Promise<UploaderResult[]>): void => {
      promise.then(
        files => {
          const onComplete = optionsMaybe?.onComplete;
          if (onComplete !== undefined) {
            onComplete(files);
          }
        },
        e => console.error(`[jquery-uploader] Unexpected error.`, e)
      );
    };

    if (
      optionsMaybe?.layout === "inline" ||
      optionsMaybe?.dropzone === true ||
      typeof optionsMaybe?.dropzone === "object"
    ) {
      const dropzone: undefined | JQueryUploaderDropzoneOptions =
        typeof optionsMaybe?.dropzone === "object" ? optionsMaybe?.dropzone : undefined;

      $(this).css({
        position: "relative",
        width: "100%",
        maxWidth: dropzone?.width ?? "600px",
        height: dropzone?.height ?? "375px"
      });

      useUploader(u =>
        $(this)
          .get()
          .forEach(element => {
            handleOnComplete(
              u.open({
                ...optionsMaybe,
                layout: "inline",
                container: element
              })
            );
          })
      );
    } else {
      $(this).on("click", function () {
        useUploader(u => handleOnComplete(u.open(optionsMaybe)));
      });
    }

    return this;
  };
})(jQuery);
