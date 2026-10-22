# Rubikc

[Rubikc](https://rubikc.com) storefront redirect theme. Dawn stays in place for Shopify pages that have to keep working, and content browsing is sent to the Rubikc storefront with `window.location`.

The storefront pages for account, cart, policies, gift cards, and the password page come from [Dawn](https://github.com/Shopify/dawn) 16.0.0.

## Setup

1. Upload the theme in **Online Store -> Themes**.
2. Open the theme editor.
3. Go to **Theme settings -> Rubikc**.
4. Set **Redirect URL** to the Rubikc storefront, for example `https://store.example.com`.
5. Publish the theme.

Leave **Redirect URL** empty to turn the redirect off.

## What redirects

These templates redirect. The current path, query string, and hash are kept, so `/products/hat?variant=1` on the online store becomes `/products/hat?variant=1` on the Rubikc host.

- Home
- Products
- Collections and the collection list
- Pages
- Blogs and articles
- Search
- Metaobjects
- 404

Product URLs that do not already have a hash open `#content-1` on the Rubikc storefront.

A hostname without `https://` is accepted. A path on the redirect URL is kept as a prefix.

## What stays on this theme

- Customer account, including the account menu
- Cart
- Checkout, which Shopify hosts outside the theme
- Policy pages
- Gift cards
- The password page
- Bot protection (`/checkpoint`, `/challenge`, `/throttle/queue`)
- Discount entry (`/discount/CODE`) and app proxies (`/apps`, `/a`, `/community`, `/tools`)

Shopify discount links still work. After Shopify sets the `discount_code` cookie, the redirect adds it as a `discount` query parameter and clears the cookie.

The theme editor does not redirect, so sections stay editable.

## Preview this theme

Add `?rubikc_stay_old=1` to stay on this theme for the current browser tab. Add `?rubikc_stay_old=0` to follow the redirect again.

## Dawn updates

Account, cart, and the other pages that stay here come from Dawn. To bring in a newer Dawn, add an `upstream` remote for `https://github.com/Shopify/dawn.git` and merge `main`.

## License

Storefront code is Dawn, copyright (c) 2021-present Shopify Inc. See [LICENSE](/LICENSE.md).
