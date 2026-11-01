# Sync for the Saved lists (owner only)

`worker.js` is a small Cloudflare Worker. It keeps one merged copy of Andres's Saved list so his devices match.
Readers never see sync: the controls stay hidden unless a device has opened a page address ending in `#hog-sync`
once, and nothing works without the secret sync key.

## How it works
- The three widgets (`resources.js`, `digest.js`, `guidelines.js`) carry the same sync code in their "SAVED CORE" block.
  Sync is off while `SYNC_URL` is empty (the default).
- Each saved item has `m` (time last changed) and each removal is remembered in `hogSavedDel`. Per item the newest
  change wins, and a removal beats an item last changed before it. The widget and the Worker use the same rule.
- A device syncs when the page opens, when you tap Sync now, a moment after each save or remove, and when you come back to the tab.
- Device clocks should be roughly right (set automatically on phones and computers).
- The Worker stores one record, `owner`, in KV: titles, links and topic headings only. Removal marks older than 180 days are dropped.

## One-time setup (free Cloudflare account)
1. Make a free account at cloudflare.com.
2. Workers & Pages > Create > Create Worker. Name it `hog-sync`, Deploy, then Edit code, replace everything with `worker.js`, Deploy.
3. Storage & Databases > KV > Create a namespace named `hog-saved`.
4. Open the Worker > Settings > Bindings > Add > KV namespace. Variable name `SAVED_KV`, namespace `hog-saved`. Save.
5. Same Settings page > Variables and Secrets > Add a **Secret** named `SYNC_KEY`. Value: a long random string of 24+ characters
   (use a password manager to generate one and keep it; it is the only thing that protects the list). Deploy.
6. Copy the Worker address (looks like `https://hog-sync.YOUR-NAME.workers.dev/`) and put it in `SYNC_URL` in the SAVED CORE
   block of all three widget files (it is one line, `SYNC_URL = ""`).

## Using it
On each device open any page with the widgets and add `#hog-sync` to the end of the address once (for example
`andresferber.org/page-1.html#hog-sync`). Open a "Saved" row, type the sync key, tap Turn on sync. Repeat on each device.
Turn off sync removes the key from that device and leaves its list alone. To change the key, change the `SYNC_KEY` secret
and enter the new key on each device.

## Tests
Run against a local copy of `worker.js` and the widgets: wrong key refused, removals travel between two browsers,
re-saving brings an item back, other sites get no permission, the service being unreachable never blocks saving.
