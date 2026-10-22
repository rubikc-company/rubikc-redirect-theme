# Rubikc

[Download rubikc.zip](https://github.com/rubikc-company/rubikc-redirect-theme/releases/latest/download/rubikc.zip)

[Rubikc](https://rubikc.com) storefront redirect theme. Dawn stays in place for Shopify pages that have to keep working, and content browsing is sent to the Rubikc storefront with `window.location`.

The storefront pages for account, policies, gift cards, and the password page come from [Dawn](https://github.com/Shopify/dawn) 16.0.0. The cart template is still Dawn, and `/cart` redirects to Rubikc.

## Setup

1. [Download rubikc.zip](https://github.com/rubikc-company/rubikc-redirect-theme/releases/latest/download/rubikc.zip). Each merge to `main` publishes a new zip on [Releases](https://github.com/rubikc-company/rubikc-redirect-theme/releases/latest).
2. In Shopify admin, open **Online Store -> Themes -> Add theme -> Upload zip file** and choose `rubikc.zip`.
3. Open the theme editor.
4. Go to **Theme settings -> Rubikc**.
5. Set **Redirect URL** to the Rubikc storefront, for example `https://store.example.com`.
6. Publish the theme.

Leave **Redirect URL** empty to turn the redirect off.

## What redirects

These templates redirect. The script is the first thing in the page, then the browser stops loading this theme. The current path, query string, and hash are kept, so `/products/hat?variant=1` on the online store becomes `/products/hat?variant=1` on the Rubikc host.

- Home
- Products
- Collections and the collection list
- Pages
- Blogs and articles
- Search
- Metaobjects
- Cart (`/cart`, including localized paths such as `/en/cart`)
- 404

Product URLs that do not already have a hash open `#content-1` on the Rubikc storefront.

A hostname without `https://` is accepted. A path on the redirect URL is kept as a prefix.

## What stays on this theme

- Customer account, including the account menu
- Cart changes (`/cart/add`, `/cart/change`, `/cart/update`)
- Checkout, which Shopify hosts outside the theme
- Policy pages
- Gift cards
- The password page
- Bot protection (`/checkpoint`, `/challenge`, `/throttle/queue`)
- Discount entry (`/discount/CODE`) and app proxies (`/apps`, `/a`, `/community`, `/tools`)

Shopify discount links still work. After Shopify sets the `discount_code` cookie, the redirect adds it as a `discount` query parameter and clears the cookie.

The theme editor does not redirect, so sections stay editable.

## Preview this theme

The theme editor does not redirect, and content templates are not built while a redirect URL is set.

Add `?rubikc_stay_old=1` to skip the redirect for the current browser tab. Add `?rubikc_stay_old=0` to follow it again.

## Dawn updates

Account and the other pages that stay here come from Dawn. The cart template remains for the theme editor and `?rubikc_stay_old=1`. To bring in a newer Dawn, add an `upstream` remote for `https://github.com/Shopify/dawn.git` and merge `main`.

## License

Storefront code is Dawn, copyright (c) 2021-present Shopify Inc. See [LICENSE](/LICENSE.md).
