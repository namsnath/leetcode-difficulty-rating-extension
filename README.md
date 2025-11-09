# leetcode-difficulty-rating-extension

[![chrome web store](https://developer.chrome.com/static/docs/webstore/branding/image/UV4C4ybeBTsZt43U4xis.png)](https://chrome.google.com/webstore/detail/leetcode-difficulty-ratin/hedijgjklbddpidomdhhngflipnibhca)
[![firefox add-on](https://extensionworkshop.com/assets/img/documentation/publish/get-the-addon-178x60px.dad84b42.png)](https://addons.mozilla.org/en-US/firefox/addon/leetcode-difficulty-rating/)

## Introduction

Replace Leetcode problem's difficulty with a more precise contest rating sourced from [here](https://github.com/zerotrac/leetcode_problem_rating).

The green/yellow/red text color is preserved, so you can still tell the official difficulty.

Problems in 1st-62nd weekly contests and problems that did not come from contests don’t have rating data and "N/A" is shown by default. To show the original rating, click the extension icon on the top right of the browser and disable "Show N/A if no rating is available".

## Preview

![screenshot-1](/images/screenshot-1.png)
![screenshot-2](/images/screenshot-2.png)

## Installation

### Chrome Web Store

* [Leetcode Difficulty Rating](https://chrome.google.com/webstore/detail/leetcode-difficulty-ratin/hedijgjklbddpidomdhhngflipnibhca)

### Manually

1. Clone this repository
2. Open the browser and go to `chrome://extensions/`
3. Enable `Developer mode` on the top-right
4. Click `Load unpacked` on the top-left
5. Select the cloned repository

### Firefox
#### Testing
1. Run `make`
2. Go to `about:debugging` > This Firefox > Load Temporary Addon
3. Select the generated `build/leetcode-difficulty-rating.zip`

#### Signing for use
1. Get API Key from https://addons.mozilla.org/es/developers/addon/api/key/
2. `npx web-ext sign --api-key=<JWT_ISSUER> --api-secret <JWT_SECRET> --channel unlisted`
3. Drag generated `.xpi` file from the `web-ext-artifacts` folder to Firefox to install

## Acknowledgement

* Ratings are based on <https://github.com/zerotrac/leetcode_problem_rating>
