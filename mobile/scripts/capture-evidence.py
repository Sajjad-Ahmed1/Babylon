import asyncio, sys
from playwright.async_api import async_playwright

BASE = 'http://localhost:8081'
OUT = '/home/claude/shots/raw/'

async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(executable_path='/usr/bin/google-chrome',
                                    proxy={'server': 'http://127.0.0.1:38515', 'bypass': 'localhost,127.0.0.1'})
        ctx = await b.new_context(viewport={'width': 390, 'height': 844}, device_scale_factor=2,
                                  locale='ar-IQ', timezone_id='Asia/Baghdad', is_mobile=True, has_touch=True)
        await ctx.grant_permissions(['notifications'], origin=BASE)
        pg = await ctx.new_page()
        pg.on('console', lambda m: print('console:', m.text) if m.type == 'error' else None)
        tid = lambda t: pg.locator(f'[data-testid="{t}"]')

        async def shot(name, wait=600):
            await pg.wait_for_timeout(wait)
            await pg.screenshot(path=OUT + name)
            print('saved', name)

        await pg.goto(BASE)
        await tid('login-button').wait_for()
        await shot('login_screen_evidence.png', 1500)

        await tid('login-email').fill('ahmed@babylon.iq')
        await tid('login-password').fill('wrongpass')
        await tid('login-button').click()
        await tid('login-error').wait_for()
        await shot('login_error.png')

        await tid('go-signup').click()
        await tid('signup-button').wait_for()
        await shot('signup_screen_evidence.png')

        await tid('signup-username').fill('ahmed_rubaie')
        await tid('signup-email').fill('ahmed@babylon')
        await tid('signup-password').fill('123')
        await tid('signup-button').click()
        await tid('signup-error').wait_for()
        await shot('signup_error.png')

        await tid('signup-email').fill('ahmed@babylon.iq')
        await tid('signup-password').fill('Babil2026')
        await tid('signup-button').click()
        await tid('settings-menu-icon').wait_for()
        await shot('home-screen-evidence.png', 1200)

        await tid('fav-renew-national-id').click()
        await tid('fav-renew-driving-license').click()
        await tid('fav-update-retirement-data').click()
        await pg.mouse.move(200, 500)
        await pg.mouse.wheel(0, -4000)
        await shot('home-after-fav.png', 900)
        import json
        boxes = {}
        for t in ['settings-menu-icon', 'detail-nav-renew-national-id', 'detail-nav-extract-birth-cert', 'detail-nav-renew-vehicle-card']:
            boxes[t] = await tid(t).bounding_box()
        json.dump(boxes, open(OUT + 'boxes.json', 'w'))

        await tid('service-renew-national-id').click()
        await tid('detail-fav-button').wait_for()
        await shot('evidence-detail-screen.png', 900)
        await pg.locator('[aria-label="Go back"], [aria-label$=", back"]').locator('visible=true').last.click(); await pg.wait_for_timeout(500)

        await tid('tab-Favorites').click()
        await shot('favorites.png', 900)

        # API
        await tid('tab-Updates').click()
        await tid('api-list').wait_for(timeout=20000)
        await shot('evidence-api-ux.png', 1200)

        await tid('tab-Profile').click()
        await shot('profile.png', 800)

        await tid('tab-Home').click()
        await tid('settings-menu-icon').click()
        await tid('settings-menu').wait_for()
        await shot('evidence-menu-items.png', 900)

        await tid('menu-settings').click()
        await tid('settings-screen').wait_for()
        await tid('toggle-large-text').click()
        await shot('evidence-settings-screen.png', 900)
        await pg.locator('[aria-label="Go back"], [aria-label$=", back"]').locator('visible=true').last.click(); await pg.wait_for_timeout(500)

        await tid('menu-notifications').click()
        await tid('notifications-screen').wait_for()
        await shot('evidence-notification-configure.png', 1200)
        await tid('test-notification').click()
        await tid('notification-banner').wait_for(timeout=8000)
        await shot('evidence-notification-alert.png', 1200)
        await pg.locator('[aria-label="Go back"], [aria-label$=", back"]').locator('visible=true').last.click(); await pg.wait_for_timeout(500)

        await tid('menu-storage').click()
        await tid('storage-screen').wait_for()
        await shot('storage-in-app.png', 900)

        # DevTools-style view of browser localStorage (same origin)
        insp = await ctx.new_page()
        await insp.set_viewport_size({'width': 900, 'height': 844})
        await insp.goto(BASE + '/storage-inspector.html')
        await insp.wait_for_timeout(500)
        await insp.screenshot(path=OUT + 'inspector.png')
        print('saved inspector')
        await b.close()

asyncio.run(main())
