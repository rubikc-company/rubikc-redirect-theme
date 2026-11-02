# Rubikc Redirect

[Download rubikc.zip](https://github.com/rubikc-company/rubikc-redirect-theme/releases/latest/download/rubikc.zip)

[Rubikc](https://rubikc.com) storefront redirect theme. Dawn stays in place for Shopify pages that have to keep working, and content browsing is sent to the Rubikc storefront with `window.location`.

The storefront pages for account, gift cards, and the password page come from [Dawn](https://github.com/Shopify/dawn) 16.0.0. Policy pages use a plain template on this theme unless **Redirect policy pages** is on. The cart template is still Dawn, and `/cart` redirects to Rubikc.

## Setup

1. [Download rubikc.zip](https://github.com/rubikc-company/rubikc-redirect-theme/releases/latest/download/rubikc.zip). Each merge to `main` publishes a new zip on [Releases](https://github.com/rubikc-company/rubikc-redirect-theme/releases/latest).
2. In Shopify admin, open **Online Store -> Themes -> Add theme -> Upload zip file** and choose `rubikc.zip`.
3. Open the theme editor.
4. Go to **Theme settings -> Rubikc Redirect**.
5. Set **Redirect URL** to the Rubikc storefront, for example `store.example.com` or `https://store.example.com`.
6. Leave **Redirect policy pages** off to show privacy, terms, and the other policy pages on this theme. Turn it on to send those pages to the redirect URL as well.
7. Publish the theme.

Leave **Redirect URL** empty to turn the redirect off. A value without `https://` is accepted, and `https://` is added in front of it. Pages that stay on this theme use a plain header. The store name links to the redirect URL, or to this store's home page when that URL is empty.

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
- Policy pages (`/policies/privacy-policy` and the other policy URLs), only when **Redirect policy pages** is turned on

Product URLs that do not already have a hash open `#content-1` on the Rubikc storefront.

A hostname without `https://` is accepted, and `https://` is added. `http://` is kept when it is already there. A path on the redirect URL is kept as a prefix.

## What stays on this theme

- Customer account, including the account menu
- Cart changes (`/cart/add`, `/cart/change`, `/cart/update`)
- Checkout, which Shopify hosts outside the theme
- Policy pages, unless **Redirect policy pages** is turned on. Those pages use a plain header and the policy text
- Gift cards
- The password page
- Bot protection (`/checkpoint`, `/challenge`, `/throttle/queue`)
- Discount entry (`/discount/CODE`) and app proxies (`/apps`, `/a`, `/community`, `/tools`)

Shopify discount links still work. After Shopify sets the `discount_code` cookie, the redirect adds it as a `discount` query parameter and clears the cookie.

The theme editor and Shopify theme preview do not redirect. Content pages, including `/cart`, show the text `Rubikc Redirect: <URL>` instead of this theme. Account and the other pages that stay here still render, so those sections stay editable. The cart template still renders with `?rubikc_stay_old=1`.

## Preview this theme

Shopify preview (the theme editor and the preview bar) shows `Rubikc Redirect: <URL>` on content pages when a redirect URL is set. Nothing is redirected. If the URL is empty, the redirect stays off and pages render with the plain header.

Add `?rubikc_stay_old=1` on the published theme to skip the redirect for the current browser tab. Add `?rubikc_stay_old=0` to follow it again.

## Dawn updates

Account and the other pages that stay here come from Dawn. The cart template remains for `?rubikc_stay_old=1`. To bring in a newer Dawn, add an `upstream` remote for `https://github.com/Shopify/dawn.git` and merge `main`.

## License

Storefront code is Dawn, copyright (c) 2021-present Shopify Inc. See [LICENSE](/LICENSE.md).
