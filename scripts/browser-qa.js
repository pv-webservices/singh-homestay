async (page) => {
  const origin = 'http://127.0.0.1:4321';
  const routes = ['/', '/about-us/', '/rooms/', '/rooms/homestay-rooms/', '/gallery/', '/nearby-places/', '/nearby-places/mlamala-waterfall/', '/nearby-places/peerumedu/', '/contact-us/', '/book-your-stay/', '/faq/', '/privacy-policy/', '/booking-policy/'];
  const errors = [];
  const brokenRequests = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('response', response => { if (response.url().startsWith(origin) && response.status() >= 400) brokenRequests.push(response.url()+': '+response.status()); });
  const results = [];
  const internalLinks = new Set();
  for (const width of [320,768,1440]) {
    await page.setViewportSize({width,height:1000});
    for (const route of routes) {
      const response = await page.goto(origin+route);
      await page.evaluate(async () => {
        document.querySelectorAll('img[src]').forEach(img => img.loading='eager');
        await document.fonts.ready;
        await Promise.all(Array.from(document.querySelectorAll('img[src]')).map(img => img.decode().catch(()=>{})));
      });
      await page.evaluate(async () => {
        for(let y=0;y<document.documentElement.scrollHeight;y+=700){scrollTo({top:y,behavior:'instant'});await new Promise(resolve=>setTimeout(resolve,70));}
        scrollTo({top:0,behavior:'instant'});
      });
      await page.waitForTimeout(1100);
      const metrics = await page.evaluate(() => ({
        title:document.title,
        h1:document.querySelectorAll('h1').length,
        width:document.documentElement.clientWidth,
        scrollWidth:document.documentElement.scrollWidth,
        description:document.querySelector('meta[name=description]')?.getAttribute('content'),
        broken:Array.from(document.querySelectorAll('img[src]')).filter(img => !img.complete || !img.naturalWidth).map(img=>img.src),
        links:Array.from(document.querySelectorAll('a[href]')).map(a=>a.getAttribute('href')).filter(href=>href.startsWith('/') && !href.startsWith('//')),
        unlabelled:Array.from(document.querySelectorAll('main input,main select,main textarea')).filter(el => !el.labels?.length && !el.getAttribute('aria-label')).map(el=>el.outerHTML),
      }));
      metrics.links.forEach(link=>internalLinks.add(link.split('#')[0].split('?')[0]));
      const failures=[];
      if (response.status()!==200) failures.push('HTTP '+response.status());
      if(metrics.h1!==1)failures.push('h1 count '+metrics.h1);
      if(metrics.scrollWidth>metrics.width+1)failures.push('horizontal overflow '+metrics.scrollWidth);
      if(!metrics.description)failures.push('missing description');
      if(metrics.broken.length)failures.push('broken images '+metrics.broken.join(', '));
      if(metrics.unlabelled.length)failures.push('unlabelled fields');
      if(width===320 || width===1440) {
        await page.addScriptTag({path:'node_modules/axe-core/axe.min.js'});
        const axe = await page.evaluate(async () => {
          const result=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']}});
          return result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));
        });
        if(axe.length)failures.push({axe});
      }
      results.push({route,width,failures});
      if(failures.length) console.log('FAIL',JSON.stringify(results[results.length-1]));
    }
    console.log('Completed viewport',width);
  }
  const linkResults=[];
  for(const link of internalLinks){const response=await page.request.get(origin+link);if(response.status()!==200)linkResults.push({link,status:response.status()});}
  for (const viewport of [{width:390,height:844},{width:1024,height:768},{width:1920,height:1080},{width:844,height:390}]) {
    await page.setViewportSize(viewport);await page.goto(origin);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);
    results.push({route:'/',width:viewport.width,height:viewport.height,failures:overflow?['overflow']:[]});
  }
  return {checks:results.length,results,linkResults,errors,brokenRequests};
}
