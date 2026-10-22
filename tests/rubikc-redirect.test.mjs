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

test('does not redirect essential Shopify routes', () => {
  for (const pathname of [
    '/account',
    '/account/orders/1',
    '/en/account/login',
    '/cart',
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
  assert.equal(resolve({ redirectTarget: '  ' }).redirect, false);
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

test('stays on this theme for the tab when requested', () => {
  assert.equal(resolve({ search: '?rubikc_stay_old=1' }).redirect, false);
  assert.equal(resolve({ stayStored: true, pathname: '/products/hat' }).redirect, false);
});
