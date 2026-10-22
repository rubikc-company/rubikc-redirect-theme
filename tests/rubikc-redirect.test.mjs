import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const source = fs.readFileSync(new URL('../snippets/rubikc-redirect.liquid', import.meta.url), 'utf8');
const match = source.match(/\/\* @rubikc-redirect \*\/([\s\S]*?)\/\* @rubikc-redirect-end \*\//);
assert.ok(match, 'redirect helpers should be marked in the snippet');

const rubikcResolveRedirect = new Function(`${match[1]}\nreturn rubikcResolveRedirect;`)();

function resolve(overrides) {
  return rubikcResolveRedirect({
    redirectTarget: 'https://an.customers.rubikc.com',
    pathname: '/collections/all',
    search: '',
    hash: '',
    hostname: 'shop.myshopify.com',
    cookie: '',
    designMode: false,
    stayStored: false,
    ...overrides,
  });
}

test('keeps the path and query string on the redirect host', () => {
  const decision = resolve({
    pathname: '/pages/about',
    search: '?view=story',
  });

  assert.equal(decision.redirect, true);
  assert.equal(decision.url, 'https://an.customers.rubikc.com/pages/about?view=story');
});

test('opens product pages on the Rubikc content anchor', () => {
  const decision = resolve({
    pathname: '/products/hat',
    search: '?variant=1',
  });

  assert.equal(decision.url, 'https://an.customers.rubikc.com/products/hat?variant=1#content-1');
});

test('keeps an existing product hash', () => {
  const decision = resolve({
    pathname: '/en/products/hat',
    hash: '#reviews',
  });

  assert.equal(decision.url, 'https://an.customers.rubikc.com/en/products/hat#reviews');
});

test('accepts a hostname and a base path', () => {
  const decision = resolve({
    redirectTarget: 'an.customers.rubikc.com/preview/',
    pathname: '/blogs/news/hello',
  });

  assert.equal(decision.url, 'https://an.customers.rubikc.com/preview/blogs/news/hello');
});

test('redirects the cart page and keeps the query string', () => {
  assert.equal(
    resolve({ pathname: '/cart', search: '?foo=1' }).url,
    'https://an.customers.rubikc.com/cart?foo=1'
  );
  assert.equal(resolve({ pathname: '/en/cart' }).url, 'https://an.customers.rubikc.com/en/cart');
  assert.equal(resolve({ pathname: '/fr-CA/cart/' }).url, 'https://an.customers.rubikc.com/fr-CA/cart/');
});

test('does not redirect essential Shopify routes', () => {
  for (const pathname of [
    '/account',
    '/account/orders/1',
    '/en/account/login',
    '/cart/add',
    '/cart/change',
    '/cart/update',
    '/checkout',
    '/checkouts/cn/abc',
    '/policies/privacy-policy',
    '/discount/SAVE10',
    '/apps/proxy',
    '/a/gift-card',
    '/challenge',
    '/checkpoint',
    '/throttle/queue',
    '/gift_cards/abc',
  ]) {
    assert.equal(resolve({ pathname }).redirect, false, pathname);
  }
});

test('does not redirect when the host already matches', () => {
  assert.equal(
    resolve({ hostname: 'an.customers.rubikc.com', pathname: '/products/hat' }).redirect,
    false
  );
});

test('does not redirect in the theme editor or without a URL', () => {
  assert.equal(resolve({ designMode: true }).redirect, false);
  assert.equal(resolve({ visualPreviewMode: true }).redirect, false);
  assert.equal(resolve({ redirectTarget: '  ' }).redirect, false);
  assert.equal(resolve({ redirectTarget: '' }).redirect, false);
});

test('Shopify preview reports the target instead of redirecting', () => {
  const decision = resolve({
    search: '?preview_theme_id=99',
    redirectTarget: 'an.customers.rubikc.com/preview/',
    pathname: '/pages/about',
  });

  assert.equal(decision.redirect, false);
  assert.equal(decision.preview, true);
  assert.equal(decision.target, 'https://an.customers.rubikc.com/preview');
});

test('adds https when the scheme is missing and keeps an explicit http URL', () => {
  assert.equal(
    resolve({ redirectTarget: 'store.example.com' }).url,
    'https://store.example.com/collections/all'
  );
  assert.equal(
    resolve({ redirectTarget: 'http://store.example.com' }).url,
    'http://store.example.com/collections/all'
  );
});

test('forwards a Shopify discount cookie and strips the stay parameter', () => {
  const decision = resolve({
    pathname: '/',
    search: '?rubikc_stay_old=0',
    cookie: 'discount_code=SAVE%2010; other=1',
  });

  assert.equal(decision.redirect, true);
  assert.equal(decision.clearStay, true);
  assert.equal(decision.clearDiscountCookie, true);
  assert.equal(decision.url, 'https://an.customers.rubikc.com/?discount=SAVE+10');
});

test('names the theme Rubikc Redirect and previews the target as text', () => {
  const schema = fs.readFileSync(new URL('../config/settings_schema.json', import.meta.url), 'utf8');
  const data = fs.readFileSync(new URL('../config/settings_data.json', import.meta.url), 'utf8');
  const layout = fs.readFileSync(new URL('../layout/theme.liquid', import.meta.url), 'utf8');

  assert.match(schema, /"theme_name": "Rubikc Redirect"/);
  assert.equal(JSON.parse(data).current, 'Rubikc Redirect');
  assert.match(layout, /<body>Rubikc Redirect: \{\{ rubikc_redirect_base \| escape \}\}<\/body>/);
  assert.match(layout, /rubikc_redirect_target != blank/);
  assert.match(layout, /unless rubikc_redirect_base contains '\:\/\/'/);
});

test('stays on this theme for the tab when requested', () => {
  assert.equal(resolve({ search: '?rubikc_stay_old=1' }).redirect, false);
  assert.equal(resolve({ stayStored: true, pathname: '/products/hat' }).redirect, false);
});
