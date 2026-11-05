// Resize every open Photoshop document to 1080 x 1350 (Instagram portrait) and save a JPEG copy.
// Your original files are never changed.
//
// How to run: in Photoshop, File > Scripts > Browse..., pick this file.
//
// It asks one question:
//   OK     = fill the frame: scale up until there are no gaps, then trim the edges evenly (centred)
//   Cancel = fit the whole image: scale down until it all fits, then fill the gaps with a solid colour
//
// The copies are saved next to each original as "<name>_1080x1350.jpg", or on the
// Desktop if the document was never saved. They are 8-bit sRGB, which is what Instagram expects.

#target photoshop

(function () {
  var W = 1080, H = 1350;
  var FILL_COLOUR = '0B0B0F'; // background for "fit" mode; change to 'FFFFFF' for white

  if (app.documents.length === 0) { alert('Open at least one image first.'); return; }

  var fill = confirm('Fill the 1080 x 1350 frame?\n\nOK = fill (crops the edges)\nCancel = fit (keeps the whole image, adds solid bars)');

  var oldUnits = app.preferences.rulerUnits;
  var oldBg = app.backgroundColor;
  app.preferences.rulerUnits = Units.PIXELS;
  var bg = new SolidColor(); bg.rgb.hexValue = FILL_COLOUR;
  app.backgroundColor = bg;

  var originals = [];
  for (var i = 0; i < app.documents.length; i++) originals.push(app.documents[i]);

  var done = 0, failed = [];
  for (var j = 0; j < originals.length; j++) {
    var doc = originals[j];
    try {
      app.activeDocument = doc;
      var copy = doc.duplicate(doc.name.replace(/\.[^.]+$/, '') + '_1080x1350', true); // merged copy

      if (copy.mode !== DocumentMode.RGB) copy.changeMode(ChangeMode.RGB);
      if (copy.bitsPerChannel !== BitsPerChannelType.EIGHT) copy.bitsPerChannel = BitsPerChannelType.EIGHT;
      try { copy.convertProfile('sRGB IEC61966-2.1', Intent.RELATIVECOLORIMETRIC, true, false); } catch (e) {}

      var w = copy.width.as('px'), h = copy.height.as('px');
      var s = fill ? Math.max(W / w, H / h) : Math.min(W / w, H / h);
      var nw = Math.max(1, Math.round(w * s)), nh = Math.max(1, Math.round(h * s));
      if (fill) { nw = Math.max(nw, W); nh = Math.max(nh, H); }   // never leave a 1 px gap from rounding
      else { nw = Math.min(nw, W); nh = Math.min(nh, H); }

      copy.resizeImage(UnitValue(nw, 'px'), UnitValue(nh, 'px'), 72, ResampleMethod.BICUBIC);
      copy.resizeCanvas(UnitValue(W, 'px'), UnitValue(H, 'px'), AnchorPosition.MIDDLECENTER);
      copy.flatten();

      var folder;
      try { folder = doc.path; } catch (e) { folder = Folder.desktop; }
      var out = new File(folder + '/' + copy.name + '.jpg');

      var opts = new JPEGSaveOptions();
      opts.quality = 12;
      opts.formatOptions = FormatOptions.STANDARDBASELINE;
      opts.embedColorProfile = true;
      copy.saveAs(out, opts, true, Extension.LOWERCASE);
      copy.close(SaveOptions.DONOTSAVECHANGES);
      done++;
    } catch (err) {
      failed.push(doc.name + ': ' + err.message);
    }
  }

  app.preferences.rulerUnits = oldUnits;
  app.backgroundColor = oldBg;

  var msg = 'Saved ' + done + ' image(s) at 1080 x 1350.';
  if (failed.length) msg += '\n\nCould not do:\n' + failed.join('\n');
  alert(msg);
})();
