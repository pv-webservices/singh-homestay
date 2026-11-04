async page => {
  const testContext = await page.context().browser().newContext();
  page = await testContext.newPage();
  const base = 'http://127.0.0.1:4321';
  const checks = [];
  const check = (name, pass) => checks.push({ name, pass });
  // Prevent contact navigation before any browser or OS protocol handler runs.
  await page.addInitScript(() => {
    window.contactAttempts = [];
    document.addEventListener('click', event => {
      const anchor = event.target.closest('a');
      if (anchor && (/^tel:/.test(anchor.href) || anchor.href.startsWith('https://wa.me/'))) {
        event.preventDefault();
        window.contactAttempts.push(anchor.href);
      }
    }, true);
  });
  await page.context().route('https://wa.me/**', route => route.abort());
  const requests = [];
  page.on('request', req => { if (req.method() !== 'GET') requests.push(req.url()); });
  for (const route of ['/', '/rooms/homestay-rooms/', '/nearby-places/peerumedu/', '/contact-us/', '/book-your-stay/']) {
    for (const width of [375, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(base + route);
      const links = await page.locator('a[href^="https://wa.me/"]').evaluateAll(links => links.map(a => a.href));
      check(`Correct contextual WhatsApp links ${route} at ${width}`, links.length > 0 && links.every(href => {
        const u = new URL(href);
        return u.pathname === '/919656553358' && u.searchParams.get('text').includes(route);
      }));
      const telephone = await page.locator('a[href^="tel:"]').evaluateAll(links => links.map(a => a.href));
      check(`Valid telephone links ${route} at ${width}`, telephone.length > 0 && telephone.every(href => /^tel:\+(?:919656553358|914869296094)$/.test(href)));
      await page.locator('.footer-contact a[href^="https://wa.me/"]').click();
      await page.locator('.footer-contact a[href^="tel:"]').first().click();
      check(`Contact clicks intercepted ${route} at ${width}`, await page.evaluate(() => window.contactAttempts.length === 2));
    }
  }
  await page.goto(base + '/contact-us/');
  await page.getByRole('button', { name: 'Prepare WhatsApp Enquiry' }).click();
  check('Empty form has field errors, summary and first-field focus', await page.evaluate(() => {
    const first = document.querySelector('[name=guestName]');
    return first === document.activeElement && first.getAttribute('aria-invalid') === 'true' && !!document.getElementById(first.getAttribute('aria-describedby')).textContent && document.querySelector('.form-status').textContent.includes('kept');
  }));
  await page.getByLabel('Your name *', { exact: true }).fill('QA <Guest> & Family');
  await page.getByLabel('Mobile number *', { exact: true }).fill('123456789');
  await page.getByLabel('Your message *', { exact: true }).fill('Directions? & room details.');
  await page.getByRole('button', { name: 'Prepare WhatsApp Enquiry' }).click();
  check('Short phone fails without losing other values', await page.getByLabel('Your name *', { exact: true }).inputValue() === 'QA <Guest> & Family' && await page.locator('[name=phone]').getAttribute('aria-invalid') === 'true');
  await page.locator('[name=phone]').evaluate(el => el.value = '+91 90000 00000');
  await page.locator('[name=guestName]').evaluate(el => el.value = 'x'.repeat(81));
  await page.getByRole('button', { name: 'Prepare WhatsApp Enquiry' }).click();
  check('Programmatic overlong name rejected', await page.locator('[name=guestName]').getAttribute('aria-invalid') === 'true');
  await page.locator('[name=guestName]').evaluate(el => el.value = 'QA <Guest> & Family');
  await page.locator('[name=message]').evaluate(el => el.value = ' '.repeat(5));
  await page.getByRole('button', { name: 'Prepare WhatsApp Enquiry' }).click();
  check('Programmatic whitespace message rejected', await page.locator('[name=message]').getAttribute('aria-invalid') === 'true');
  await page.locator('[name=message]').evaluate(el => el.value = 'Directions? & room details.');
  await page.getByRole('button', { name: 'Prepare WhatsApp Enquiry' }).click();
  const link = page.getByRole('link', { name: 'Open WhatsApp with My Enquiry' });
  const url = new URL(await link.getAttribute('href'));
  check('Encoded message retains symbols and source path', url.searchParams.get('text').includes('QA <Guest> & Family') && url.searchParams.get('text').includes('Directions? & room details.') && url.searchParams.get('text').includes('/contact-us/'));
  check('Summary escapes markup as text', await page.locator('.enquiry-result pre').evaluate(el => !el.querySelector('guest') && el.textContent.includes('<Guest>')));
  await link.click();
  check('Blocked handoff preserves values and call fallback', await page.getByLabel('Your name *', { exact: true }).inputValue() === 'QA <Guest> & Family' && await page.locator('.footer-contact a[href="tel:+919656553358"]').isVisible());
  await page.locator('[name=phone]').evaluate(el => el.value = '123');
  await link.click();
  check('Handoff revalidates silent autofill changes', await page.locator('[name=phone]').getAttribute('aria-invalid') === 'true' && !await link.isVisible());
  check('No backend submissions', requests.length === 0);
  check('No enquiry data saved in browser storage', await page.evaluate(() => localStorage.length === 0 && sessionStorage.length === 0));
  await page.addScriptTag({ path: 'node_modules/axe-core/axe.min.js' });
  const issues = await page.evaluate(async () => (await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } })).violations.map(v => v.id));
  check('Validation error state passes axe', issues.length === 0);
  const result = { passed: checks.filter(c => c.pass).length, total: checks.length, failures: checks.filter(c => !c.pass), issues, contactDelivery: 'All contact clicks prevented; no calls, WhatsApp requests or messages sent.' };
  await testContext.close();
  return result;
}
