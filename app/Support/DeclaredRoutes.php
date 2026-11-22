<?php

declare(strict_types=1);

namespace App\Support;

use App\Declarations\DomainUi;
use App\Exceptions\UiPrefixUnavailable;
use App\Http\Controllers\Web\PageController;
use App\Support\Web\DeclaredRouteKey;
use App\Values\FolderEntry;
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

            if ($taken !== [] && ! $prefixes[$taken[0]]->owns((string) $route->getControllerClass())) {
                throw UiPrefixUnavailable::usedByRoute($taken[0], $route->uri());
            }
        }

        $code = CodeFiles::ofProcess();

        $publicNames = array_map(
            fn (FolderEntry $entry) => $entry->name(),
            $code->folder($code->projectPathOf("{$publicFolder}/*"))->entries,
        );

        foreach (array_keys($prefixes) as $prefix) {
            if (in_array($prefix, $publicNames, true)) {
                throw UiPrefixUnavailable::usedByPublicFile($prefix);
            }
        }
    }

    private function requireVisibility(Route $route, string $key): void
    {
        $route->defaults(DeclaredRouteKey::NAME, $key)->middleware("journal.visible:{$key}");
    }

    /**
     * Each domain prefix with the domain that owns it.
     *
     * @return array<string, DomainUi>
     */
    private function prefixes(): array
    {
        $prefixes = [];

        foreach ($this->declarations->pages() as $page) {
            if (! $page->isHome()) {
                $prefixes[$page->owner->key] = $page->owner;
            }
        }

        foreach ($this->declarations->actions() as $action) {
            $prefixes[$action->owner->key] = $action->owner;
        }

        return $prefixes;
    }
}
