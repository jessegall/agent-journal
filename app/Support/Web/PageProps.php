<?php

declare(strict_types=1);

namespace App\Support\Web;

use App\Contracts\Navigation\UiOwnerAvailability;
use App\Contracts\Navigation\WindowResults;
use App\Contracts\Reads\ReaderRequests;
use App\Data\UnavailableWindow;
use App\Declarations\RegisteredPage;
use App\Declarations\RegisteredSection;
use App\Enums\PageDestination;
use App\Http\Requests\Web\DeclaredPageRequest;
use App\Support\UiDeclarations;
use Illuminate\Http\Request;
use Illuminate\Routing\Route;
use Inertia\ResponseFactory;
use PhpOption\Option;
use Spatie\LaravelData\Data;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * The props of a declared page: its own result as page, each section of its slots as its own deferred prop, the
 * record open in the inspector as an optional prop, and on Home one optional prop per window. Every prop runs its
 * visibility checks before any reader, on full and partial
 * requests alike, so a forged partial request for a hidden prop gets a denied result.
 */
final readonly class PageProps
{
    public function __construct(
        private UiDeclarations $declarations,
        private WindowResults $windowResults,
        private ReaderRequests $readers,
        private SlotContexts $contexts,
        private ResponseFactory $inertia,
        private UiOwnerAvailability $owners,
    ) {}

    /**
     * A page of its own: its reader reads the plain query.
     *
     * @return array<string, mixed>
     */
    public function forPage(RegisteredPage $page, DeclaredPageRequest $request): array
    {
        $props = ['title' => $page->page->title, 'page' => fn () => $this->ownPageResult($page, $request)];

        $route = $request->route() instanceof Route ? $request->route() : null;

        foreach ($this->sectionsOf($page) as $section) {
            $props[$section->propName] = $this->inertia->defer(
                fn () => $this->sectionResult($section, $request, $route),
                $section->propName,
            );
        }

        $props['inspector'] = $this->inertia->optional(fn () => $this->inspectorResult($request));

        // The record open in the inspector mounts its own sections, read with its route rather than the page's.
        foreach ($this->inspectedPage($request)->map($this->sectionsOf(...))->getOrElse([]) as $section) {
            $props["inspector_{$section->propName}"] = $this->inertia->optional(
                fn () => $this->sectionResult($section, $request, $this->inspectedRoute($section->host, $request)),
            );
        }

        // Home also offers every window as its own optional prop.
        return $page->isHome() ? [...$props, ...$this->forHome($request)] : $props;
    }

    /**
     * Home: one optional prop per window, each reading only its own part of the query, window[full.page.key], one per
     * copy of a window the visit asks for, and one per section of a window's slots.
     *
     * @return array<string, mixed>
     */
    public function forHome(DeclaredPageRequest $request): array
    {
        $props = [];

        foreach ($this->declarations->pages() as $page) {
            if ($page->page->opensIn !== PageDestination::Page || ! $this->owners->isAvailable($page->owner)) {
                continue;
            }

            $props[$page->propName] = $this->inertia->optional(
                fn () => $this->pageResult($page, $request, $request->windowQuery($page->key)),
            );

            // A further copy of the window reads its own part of the query, window[<full page key>~<copy id>].
            foreach ($request->copiesAskedFor($page->propName) as $copyId) {
                $props["{$page->propName}__{$copyId}"] = $this->inertia->optional(
                    fn () => $this->pageResult($page, $request, $request->windowQuery("{$page->key}~{$copyId}")),
                );
            }

            if ($page->isHome()) {
                continue;
            }

            foreach ($this->sectionsOf($page) as $section) {
                $loadSection = fn () => $this->sectionResult($section, $request, null);
                $props[$section->propName] = $this->inertia->optional($loadSection);
            }
        }

        return $props;
    }

    /**
     * A page of its own whose record is unavailable answers 404 at its address, the same for a missing record and one
     * outside the user's scope; in a window or the inspector the same record reads as unavailable instead.
     */
    private function ownPageResult(RegisteredPage $page, DeclaredPageRequest $request): Data
    {
        $result = $this->pageResult($page, $request, $request->plainQuery());

        if ($result instanceof UnavailableWindow) {
            throw new NotFoundHttpException();
        }

        return $result;
    }

    /**
     * @param  array<string, mixed>  $query
     */
    private function pageResult(
        RegisteredPage $page,
        DeclaredPageRequest $request,
        array $query,
        Route|null $route = null,
    ): Data {
        return $this->windowResults->result(
            $page->key,
            $page->visibilityChecks(),
            $page->resolver,
            fn (): Data => $this->readers->pageReader($page->key, $page->resolver, $request, $query, $route)->read(),
        );
    }

    /**
     * The record open in the inspector, named by ?inspect=<full page key> and the record page's route parameters in the
     * query; the record page's reader reads them as its own route. Nothing open, or an unknown or ordinary page, gives
     * no inspector.
     */
    private function inspectorResult(DeclaredPageRequest $request): Data|null
    {
        $page = $this->inspectedPage($request);

        if ($page->isEmpty()) {
            return null;
        }

        return $this->pageResult($page->get(), $request, [], $this->inspectedRoute($page->get(), $request));
    }

    /**
     * The record page the visit opens in the inspector: an inspector page of an available owner, or none.
     *
     * @return Option<RegisteredPage>
     */
    private function inspectedPage(DeclaredPageRequest $request): Option
    {
        return $this->declarations->pageOrNone($request->inspectedPage())->filter(
            fn (
                RegisteredPage $found,
            ) => $found->page->opensIn === PageDestination::Inspector && $this->owners->isAvailable($found->owner),
        );
    }

    /**
     * The inspected record page's own route, bound to the route arguments the query names for it.
     */
    private function inspectedRoute(RegisteredPage $record, DeclaredPageRequest $request): Route
    {
        $routeArguments = array_map($request->parameter(...), $record->path->parameters);
        $route = new Route(['GET'], $record->uri, []);

        $route->bind(
            Request::create(
                '/'.strtr(
                    $record->uri,
                    array_combine(
                        array_map(fn (string $name) => '{'.$name.'}', $record->path->parameters),
                        $routeArguments,
                    ),
                ),
            ),
        );

        return $route;
    }

    /**
     * A section's result, read in the context its slot hands it from the route of the page it is mounted on; nothing
     * open gives no result, and a record the user may not read reads as unavailable.
     */
    private function sectionResult(
        RegisteredSection $section,
        DeclaredPageRequest $request,
        Route|null $route,
    ): Data|null {
        $argument = $this->contexts->argumentFor($section->slot, $request, $route);

        if ($argument->isEmpty()) {
            return null;
        }

        return $this->windowResults->result(
            $section->key,
            $section->visibilityChecks(),
            $section->resolver,
            fn (): Data => $this->readers->sectionReader(
                $section->key,
                $section->resolver,
                $request,
            )->read($this->contexts->contextFor($section->slot, $argument->get())),
        );
    }

    /**
     * @return list<RegisteredSection>
     */
    private function sectionsOf(RegisteredPage $page): array
    {
        return array_values(
            array_filter(
                $this->declarations->sections(),
                fn (
                    RegisteredSection $section,
                ) => $section->host->key === $page->key && $this->owners->isAvailable($section->owner),
            ),
        );
    }
}
