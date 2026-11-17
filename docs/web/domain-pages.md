# Domain pages: declaring what a domain shows

A domain, or a module installed outside `app`, shows pages in the browser by declaring them. Web registers the routes,
builds the props and the navigation, and generates the browser files; the domain never edits Web. Doc 12 is the design;
this file is how it works now.

## Declare

A domain's descriptor implements the interfaces it needs, each in `App\Domain\Contracts`:

```php
final class NotesDomain implements Domain, ProvidesNavigation, ProvidesPages, ProvidesSections
{
    public function pages(): array
    {
        return [
            Page::make('index', 'Notes', Icon::Docs, NotesWindowReader::class, 'Index.vue')->at(''),
            Page::make('collection', 'Collection', Icon::Docs, CollectionWindowReader::class, 'Collection.vue')
                ->at('collections/{collection}')
                ->slots(Slot::record('note', 'collection')),
        ];
    }

    public function navigation(): array
    {
        return [
            NavigationItem::page('index', 'Notes', Icon::Docs, position: 50)->children([
                NavigationItem::heading('collections', 'Collections', childrenReader: CollectionChildren::class),
            ]),
        ];
    }

    public function sections(): array
    {
        return [Section::make('count', 'Notes', 'chat.dock', SlotContextKind::Session, NoteSectionReader::class, 'NoteSection.vue')];
    }
}
```

That is the whole module of `tests/Fixtures/Modules/Notes`, which `tests/Feature/Web/ExternalModulePagesTest.php` serves
through the same routes, props and navigation as the domains'.

- **Keys** are local; the foundation prefixes them with the domain's name (`notes.index`), which also gives the route
  prefix (`/notes`), the route names (`notes.index`) and the component names (`notes/Index`).
- **A page** names its reader and its component under the domain's `Resources/js`. `->onHome(n)` offers it as a window on
  Home; `->inInspector()` opens it in the inspector; `->visibleWhen(Check::class)` adds a visibility check; `->slots()`
  lists the slots other domains' sections may fill; `->actions(ActionRoute::post(...))` declares its write routes, each an
  invokable controller of the domain.
- **A section** fills another page's slot (`chat.dock`, `web.bar`, `plans.inspector`) and takes the context the slot
  offers: nothing, the chosen agent session, or the host page's record.
- **Navigation** items link to the domain's own pages with exact route and query values; a children reader lists records
  as items, checked like static ones, and a key met twice is refused.

Every declaration is checked when the application starts (`UiDeclarations::check`): repeated keys or paths, a route
value that does not fit, a missing component, a slot that does not exist or takes another context, and a domain prefix
another route or a public folder already uses all stop the start-up.

## Read

- **A page reader** implements `PageReader::read(): Data` and declares its concrete Data class as the return type; a
  section reader implements `SectionReader::read(SlotContext): Data`. Both are built per request, with their own form
  request class (only their part of the query) and the current actor in their constructor.
- **Visibility runs first.** Web runs the page's checks (for a section, the host's and then its own) before any reader,
  on every full and partial request. A refused check gives a `denied` result and calls no reader.
- **Failures stay small.** A reader that throws gives its prop a `failed` result with a neutral message and logs the
  error with the key; the other props still answer. A sign-in, CSRF, validation, redirect or HTTP error answers as
  itself. A record that cannot be read should throw `NotFoundHttpException`.
- **A section re-checks its context**: a session through Core's `SessionReader`, a record through the owner's own reader.

## Show

A page or window component takes one required prop, `data`, typed with the reader's Data from
`@generated/types/<domain>`; the page host unwraps the result. A component may import only its own files,
`@domain/<itself>`, `@kit`, `@generated/types/<itself>` and `@generated/routes/<itself>`, and packages
(`npm run imports:check`). `@kit/useWindowQuery` builds links that change only the window's own query.

## Build and deploy

`npm run types:generate` runs, in this order: `php artisan journal:ui-manifest`, `php artisan wayfinder:generate
--with-form`, `php artisan typescript:transform`. The build, the check and the type check run it first, then the import
check. A component expecting other Data than its reader returns fails `vue-tsc` through `ui-prop-checks.ts`.

Installing or removing a module is a line in `bootstrap/domains.php` and a deploy: the next build regenerates the
manifest, routes and types, and `php artisan route:cache` caches the declared routes with their guards (checked in
`DeclaredRoutesTest`). A removed module's URLs answer 404.

## Not built yet

The sidebar does not yet draw the navigation tree (the shared `navigation` and `navigationCounts` props are there); the
version 5 look for windows, panes and the inspector is plan work of its own (tasks 179 and 180); a domain's Vue is not
yet rendered on the server by a separate SSR entry (the one `app.ts` serves both).
