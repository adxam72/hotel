# Hotel Istiqlol

React 19, TypeScript, Vite, Tailwind CSS and Motion for React. Uzbek, Russian and English.

## Run

```sh
npm ci
npm run dev
```

```sh
npm run build
npm run preview
```

## Design and content

The public website uses white, graphite and blue, large photography, responsive layouts and Motion animations. Reduced-motion preferences are respected. Original hotel photos are stored unchanged in `public/images`: the facade and the interior staircase. These are displayed as hotel photographs rather than advertised as specific room interiors. Original Deluxe and Standard room types remain; room cards display neutral decorative bed illustrations until actual room photos are supplied through the admin panel. Existing reviews, phone number and map location are retained.

## Administration

Open `/admin` using the existing login. Ctrl+Shift+A and five taps on the footer copyright also open administration.

- **Mehmonxona**: edit hotel name, localized subtitle, description and address, telephone, map coordinates, hero photo and hotel gallery.
- **Xonalar**: add, edit or remove room types, replace the main photo, add gallery photos and videos.
- **Izohlar**: manage existing guest reviews.
- **Statistika**: existing browser-local visit statistics.

All original storage keys remain compatible. Hotel settings use `hotel_settings`. Changes are propagated to the public page in the same browser, including other open tabs. Viewing administration does not overwrite the original room or review data. Uploaded images are resized in the browser for storage. Storage errors are shown rather than reported as a successful save.

**Persistence limitation:** the existing application uses localStorage. Admin changes and reviews are stored in the current browser only. The existing client-side admin login is not server authentication. A shared publishing system requires backend authentication and persistent media/database storage; this redesign does not claim to provide that backend.

Booking buttons open the hotel telephone enquiry dialog; there is no live availability or reservation API. Native dialogs contain focus, close with Escape and restore focus. The photo viewer supports previous/next controls and arrow keys.

## Local dependency workaround

The C drive ran out of space during installation. On the development machine, `node_modules` is a junction to `D:\CodexHotelDependencies-20261005\node_modules`. Other machines only need `npm ci`; that D-drive folder is not required. Low-memory validation uses the bundled Node runtime with `--single-threaded --max-old-space-size=256 --max-semi-space-size=1`, `RAYON_NUM_THREADS=1` and `GOMAXPROCS=2`. TypeScript checking also uses `--jitless`; Vite requires WebAssembly, so its build must omit that flag.
