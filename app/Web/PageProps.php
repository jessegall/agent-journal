<?php

declare(strict_types=1);

namespace App\Web;

use App\Http\Requests\Web\DeclaredPageRequest;
use App\Navigation\Contracts\ClientOwnerAvailability;
use App\Navigation\Contracts\WindowResults;
use App\Reads\Contracts\ReaderRequests;
use App\Support\ClientDeclarations;
use App\Support\VisibilityCheckRunner;
use App\Web\Attributes\Live;
use App\Web\Creation\PageFactory;
use App\Web\Creation\SurfaceAttributeMap;
use App\Web\Creation\SurfaceDefinition;
use App\Web\Creation\SurfacePropPolicy;
use App\Web\Creation\WindowFactory;
use App\Web\Data\HomeVisitProps;
use App\Web\Data\Pages\UnavailableWindow;
use App\Web\Data\ScheduledSurfaceProp;
use App\Web\Declarations\RegisteredPage;
use App\Web\Declarations\RegisteredSection;
use App\Web\Enums\PageDestination;
use App\Web\Values\WindowInstance;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Routing\Route;
use Inertia\ResponseFactory;
use Inertia\SupportsLiveUpdates;
use PhpOption\Option;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Lazy;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * The props of a declared page: its own result, each section of its slots as a deferred prop, the record open in the
 * inspector, and on Home one optional prop per window. Every prop runs its visibility checks before any reader, so a
 * forged partial request for a hidden prop is denied.
 */
final readonly class PageProps
{
    /**
     * The props every declared page has, besides one per section and, on Home, one per window.
     */
    public const string TITLE = 'title';

    public const string PAGE = 'page';

    public const string INSPECTOR = 'inspector';

    public function __construct(
        private ClientDeclarations $declarations,
        private WindowResults $windowResults,
        private ReaderRequests $readers,
        private SlotContexts $contexts,
        private LiveProps $live,
        private ClientOwnerAvailability $owners,
        private PageFactory $pages,
        private WindowFactory $windows,
        private SurfaceAttributeMap $policies,
        private ResponseFactory $inertia,
        private VisibilityCheckRunner $visibility,
    ) {}

    /**
     * A page of its own: its reader reads the plain query.
     *
     * @return array<string, mixed>
     */
    public function forPage(RegisteredPage $page, DeclaredPageRequest $request): array
    {
        $readPage = fn () => $this->ownPageResult($page, $request);
        $policy = $this->policies->forPage($page->surface->type)->prop;
        $props = $page->isHome()
            ? $this->homeShell($page, $readPage, $policy)
            : [
                self::TITLE => $page->page->title,
                self::PAGE => $this->scheduled($this->lazy($readPage, $policy), $policy->live),
            ];
        $component = $page->componentName();
        $route = $request->route() instanceof Route ? $request->route() : null;

        foreach ($this->sectionsOf($page) as $section) {
            if (! $this->visibility->allow($section->visibilityChecks())) {
                continue;
            }

            $policy = $this->policies->forType($section->resolver->dataClass)->prop;
            $read = fn () => $this->sectionResult($section, $request, $route);
            $props[$section->propName] = $this->scheduled(
                $this->lazy($read, $policy, $section->propName),
                $policy->live,
            );
        }

        if ($request->asksFor($component, self::INSPECTOR)) {
            $props[self::INSPECTOR] = $this->scheduled(Lazy::inertia(fn () => $this->inspectorResult($request)));
        }

        foreach ($this->inspectedPage($request)->map($this->sectionsOf(...))->getOrElse([]) as $section) {
            $name = "inspector_{$section->propName}";

            if ($request->asksFor($component, $name) && $this->visibility->allow($section->visibilityChecks())) {
                $props[$name] = $this->scheduled(Lazy::inertia(
                    fn () => $this->sectionResult($section, $request, $this->inspectedRoute($section->host, $request)),
                ));
            }
        }

        return $page->isHome() ? [
            ...$props,
            ...$this->forHome($request, $component),
        ] : $props;
    }

    /** @return array<string, mixed> */
    private function homeShell(RegisteredPage $page, Closure $read, SurfacePropPolicy $policy): array
    {
        $props = HomeVisitProps::build()
            ->title($this->inertia->always($page->page->title))
            ->page(Lazy::closure($read))
            ->finish()
            ->toArray();
        $props[self::PAGE] = $this->live->value($props[self::PAGE], $policy->live);

        return $props;
    }

    private function lazy(Closure $read, SurfacePropPolicy $policy, string|null $defaultGroup = null): Lazy
    {
        if ($policy->isOptional) {
            return Lazy::inertia($read);
        }

        $group = $policy->deferred?->group ?? $defaultGroup;

        return $group === null ? Lazy::closure($read) : Lazy::inertiaDeferred($read, $group);
    }

    private function scheduled(Lazy $value, Live|null $live = null): mixed
    {
        $prop = ScheduledSurfaceProp::build()->value($value)->finish()->toArray()['value'];

        return match (true) {
            $prop instanceof SupportsLiveUpdates => $this->live->mark($prop, $live),
            $prop instanceof Closure => $this->live->value($prop, $live),
            default => $prop,
        };
    }

    /**
     * Home: one optional prop per window, each reading only its own part of the query, window[full.page.key], one per
     * copy of a window the visit asks for, and one per section of a window's slots.
     *
     * @return array<string, mixed>
     */
    private function forHome(DeclaredPageRequest $request, string $component): array
    {
        $props = [];

        foreach ($this->declarations->pages() as $page) {
            if ($page->window === null || ! $this->owners->isAvailable($page->owner)) {
                continue;
            }

            $window = $page->window;
            $policy = $this->policies->forType($window->type);
            $checks = [
                ...$page->visibilityChecks(),
                ...$policy->checks,
            ];
            $instances = [WindowInstance::original($page->key)];

            foreach ($request->copiesAskedFor($page->propName) as $copyId) {
                $instances[] = WindowInstance::copy($page->key, $copyId);
            }

            foreach ($instances as $instance) {
                $name = $instance->prop($page->propName);

                if ($request->asksFor($component, $name) && $this->visibility->allow($checks)) {
                    $props[$name] = $this->scheduled(
                        $this->lazy(fn () => $this->windowResult($page, $window, $request, $instance), $policy->prop),
                        $policy->prop->live,
                    );
                }
            }

            foreach ($this->sectionsOf($page) as $section) {
                if ($request->asksFor($component, $section->propName)
                    && $this->visibility->allow($section->visibilityChecks())) {
                    $props[$section->propName] = $this->scheduled(Lazy::inertia(
                        fn () => $this->sectionResult($section, $request, null),
                    ));
                }
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
        $result = $this->pageResult($page, 'page', fn () => $request->visit($request->plainQuery()));

        if ($result instanceof UnavailableWindow) {
            throw new NotFoundHttpException();
        }

        return $result;
    }

    /** @param Closure(): Request $visit */
    private function pageResult(RegisteredPage $page, string $place, Closure $visit): Data
    {
        return $this->windowResults->surface(
            $page->key,
            "{$place} {$page->key}",
            $page->visibilityChecks(),
            $page->surface,
            fn () => $this->pages->create($page->surface->type, $visit()),
        );
    }

    private function windowResult(
        RegisteredPage $page,
        SurfaceDefinition $window,
        DeclaredPageRequest $request,
        WindowInstance $instance,
    ): Data {
        $policy = $this->policies->forType($window->type);

        return $this->windowResults->surface(
            $page->key,
            'window '.$instance->name(),
            [...$page->visibilityChecks(), ...$policy->checks],
            $window,
            function () use ($window, $request, $instance, $policy): Data {
                $made = $this->windows->create($window->type, $request->windowVisit($instance));
                $policy->assertRows($made);

                return $made;
            },
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

        $record = $page->get();

        return $this->pageResult(
            $record,
            'inspector',
            fn () => $request->visit([], $this->inspectedRoute($record, $request)),
        );
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
            fn () => $this->readers->sectionReader(
                $section->key,
                $section->resolver,
                $request->visit($request->plainQuery(), $route),
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
