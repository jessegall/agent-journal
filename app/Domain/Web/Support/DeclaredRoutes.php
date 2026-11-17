<?php

declare(strict_types=1);

namespace App\Domain\Web\Support;

use App\Domain\Declarations\RegisteredAction;
use App\Domain\Declarations\RegisteredPage;
use App\Domain\UiDeclarations;
use App\Domain\Web\Exceptions\UiPrefixUnavailable;
use App\Domain\Web\Http\Controllers\PageController;
use App\Domain\Web\Http\DeclaredRouteKey;
use Illuminate\Routing\Route;
use Illuminate\Routing\RouteCollectionInterface;
use Illuminate\Routing\Router;

/**
 * Registers a route for every declared page and action, behind the session, sign-in, user and visibility checks, and
 * refuses a domain prefix that a route or a public file of someone else already uses.
 */
final readonly class DeclaredRoutes
{
    private const string HOME = 'web.home';

    public function __construct(private UiDeclarations $declarations) {}

    public function register(Router $router): void
    {
        $router->middleware(['web', 'auth', 'journal.user'])->group(function () use ($router): void {
            foreach ($this->declarations->pages() as $page) {
                $this->requireVisibility($router->get($this->uriOf($page), PageController::class)->name($this->nameOf($page)), $page->key);
            }

            foreach ($this->declarations->actions() as $action) {
                $this->requireVisibility($router->match([$action->action->method->value], $action->uri, $action->action->controller)->name($action->routeName), $action->guard->key);
            }
        });
    }

    /**
     * Refuses a domain prefix already used by a route this class did not register, by a route name, or by a file or
     * folder in public; run once every provider has registered its routes.
     */
    public function refuseTakenPrefixes(RouteCollectionInterface $routes, string $publicFolder): void
    {
        $prefixes = $this->prefixes();

        foreach ($routes->getRoutes() as $route) {
            if (array_key_exists(DeclaredRouteKey::NAME, $route->defaults)) {
                continue;
            }

            $taken = array_values(array_intersect([explode('/', $route->uri())[0], explode('.', (string) $route->getName())[0]], $prefixes));

            if ($taken !== []) {
                throw UiPrefixUnavailable::usedByRoute($taken[0], $route->uri());
            }
        }

        foreach ($prefixes as $prefix) {
            if (file_exists("{$publicFolder}/{$prefix}")) {
                throw UiPrefixUnavailable::usedByPublicFile($prefix);
            }
        }
    }

    private function requireVisibility(Route $route, string $key): void
    {
        $route->defaults(DeclaredRouteKey::NAME, $key)->middleware("journal.visible:{$key}");
    }

    /**
     * Web's Home is the root of the site; every other page lives under its domain's prefix.
     */
    private function uriOf(RegisteredPage $page): string
    {
        return $page->key === self::HOME ? '/' : $page->uri;
    }

    private function nameOf(RegisteredPage $page): string
    {
        return $page->key === self::HOME ? 'home' : $page->key;
    }

    /**
     * @return list<string>
     */
    private function prefixes(): array
    {
        $prefixes = [
            ...array_map(fn (RegisteredPage $page) => $page->owner->key, array_filter($this->declarations->pages(), fn (RegisteredPage $page) => $page->key !== self::HOME)),
            ...array_map(fn (RegisteredAction $action) => $action->owner->key, $this->declarations->actions()),
        ];

        return array_values(array_unique($prefixes));
    }
}
