<?php

declare(strict_types=1);

namespace App\Http\Support\Web;

use App\Http\Requests\Web\DeclaredPageRequest;
use App\Ui\Declarations\RegisteredPage;
use App\Ui\Declarations\RegisteredSection;
use App\Ui\Enums\PageDestination;
use App\Ui\Support\UiDeclarations;
use App\Web\Contracts\ReaderRequests;
use App\Web\Contracts\UiOwnerAvailability;
use App\Web\Contracts\WindowResults;
use Illuminate\Http\Request;
use Illuminate\Routing\Route;
use Inertia\ResponseFactory;
use Spatie\LaravelData\Data;

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
        $props = ['page' => fn () => $this->pageResult($page, $request, $request->plainQuery())];

        foreach ($this->sectionsOf($page) as $section) {
            $props[$section->propName] = $this->inertia->defer(
                fn () => $this->sectionResult($section, $request),
                $section->propName,
            );
        }

        $props['inspector'] = $this->inertia->optional(fn () => $this->inspectorResult($request));

        // Home also offers every window as its own optional prop.
        return $page->isHome() ? [...$props, ...$this->forHome($request)] : $props;
    }

    /**
     * Home: one optional prop per window, each reading only its own part of the query, window[full.page.key].
     *
     * @return array<string, mixed>
     */
    public function forHome(DeclaredPageRequest $request): array
    {
        $props = [];

        foreach ($this->declarations->pages() as $page) {
            if ($page->page->opensIn === PageDestination::Page && $this->owners->isAvailable($page->owner)) {
                $props[$page->propName] = $this->inertia->optional(
                    fn () => $this->pageResult($page, $request, $request->windowQuery($page->key)),
                );
            }
        }

        return $props;
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
        return $this->results->result(
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
        $page = $this->declarations->pageOrNone($request->inspectedPage())->filter(
            fn (
                RegisteredPage $found,
            ) => $found->page->opensIn === PageDestination::Inspector && $this->owners->isAvailable($found->owner),
        );

        if ($page->isEmpty()) {
            return null;
        }

        $record = $page->get();
        $routeArguments = array_map($request->parameter(...), $record->path->parameters);
        $route = new Route(['GET'], $record->uri, []);
        $route->bind(
            Request::create(
                '/'.strtr(
                    $record->uri,
                    array_combine(array_map(fn (string $name) => '{'.$name.'}', $record->path->parameters), $routeArguments),
                ),
            ),
        );

        return $this->pageResult($record, $request, [], $route);
    }

    private function sectionResult(RegisteredSection $section, DeclaredPageRequest $request): Data|null
    {
        $context = $this->contexts->for($section->slot, $request);

        if ($context->isEmpty()) {
            return null;
        }

        return $this->results->result(
            $section->key,
            $section->visibilityChecks(),
            $section->resolver,
            fn (): Data => $this->readers->sectionReader(
                $section->key,
                $section->resolver,
                $request,
            )->read($context->get()),
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
