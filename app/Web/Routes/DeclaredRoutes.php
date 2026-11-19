<?php

declare(strict_types=1);

namespace App\Web\Routes;

use App\Http\Controllers\Web\PageController;
use App\Http\Support\Web\DeclaredRouteKey;
use App\Ui\Support\UiDeclarations;
use App\Web\Exceptions\UiPrefixUnavailable;
use Illuminate\Routing\Route;
use Illuminate\Routing\RouteCollectionInterface;
use Illuminate\Routing\Router;

/**
 * Registers a route for every declared page and action, behind the session, sign-in, user and visibility checks, and
 * refuses a domain prefix that a route or a public file of someone else already uses.
 */
final readonly class DeclaredRoutes
{
    public function __construct(private UiDeclarations $declarations) {}

    public function register(Router $router): void
    {
        $router->middleware(['web', 'auth', 'journal.user'])->group(function () use ($router): void {
            foreach ($this->declarations->pages() as $page) {
                $this->requireVisibility(
                    $router->get($page->address(), PageController::class)->name($page->routeName()),
                    $page->key,
                );
            }

            foreach ($this->declarations->actions() as $action) {
                $this->requireVisibility(
                    $router->match(
                        [$action->action->method->value],
                        $action->uri,
                        $action->action->controller,
                    )->name($action->routeName),
                    $action->guard->key,
                );
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

            $taken = array_values(
                array_intersect(
                    [explode('/', $route->uri())[0], explode('.', (string) $route->getName())[0]],
                    array_keys($prefixes),
                ),
            );

            if ($taken !== [] && ! $this->ownedBy($route, $prefixes[$taken[0]])) {
                throw UiPrefixUnavailable::usedByRoute($taken[0], $route->uri());
            }
        }

        foreach (array_keys($prefixes) as $prefix) {
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
     * Each domain prefix with the namespace of the domain that owns it.
     *
     * @return array<string, string>
     */
    private function prefixes(): array
    {
        $prefixes = [];

        foreach ($this->declarations->pages() as $page) {
            if (! $page->isHome()) {
                $prefixes[$page->owner->key] = $page->owner->namespace;
            }
        }

        foreach ($this->declarations->actions() as $action) {
            $prefixes[$action->owner->key] = $action->owner->namespace;
        }

        return $prefixes;
    }

    /**
     * A route the domain itself registered elsewhere, such as its agent routes, shares its prefix by right.
     */
    private function ownedBy(Route $route, string $namespace): bool
    {
        return str_starts_with((string) $route->getControllerClass(), $namespace.'\\');
    }
}
