Self-hosted web fonts (latin subset, WOFF2), served from this folder so the site makes
no third-party font requests and can preload them.

  newsreader-latin.woff2          Newsreader — variable optical size (6–72), weight 400
  schibsted-grotesk-latin.woff2   Schibsted Grotesk — variable weight 400–700

Both families are licensed under the SIL Open Font License 1.1 (https://openfontlicense.org)
and were obtained from Google Fonts (https://fonts.google.com).

To change or extend them, replace the files and update the @font-face rules at the top of
src/index.css and the preload links in index.html.
