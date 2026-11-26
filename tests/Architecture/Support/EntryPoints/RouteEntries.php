<?php

declare(strict_types=1);

namespace Tests\Architecture\Support\EntryPoints;

use App\Http\Controllers\Web\PageController;
use App\Support\ClientDeclarations;
use App\Support\Web\DeclaredRouteKey;
use Illuminate\Routing\Route;
use Illuminate\Routing\Router;
use Illuminate\Support\Str;

/**
 * Every method of every route a journal controller, of core or of a domain, answers, by its name, tested in the
 * routes folder of its owner, the domain that declares a page or the controller's; the hook answer route is left to the
 * hook moments. Beside them stand the journal's routes that have no name and the routes of every other controller.
 */
final readonly class RouteEntries
{
    private const string HOOK_ANSWER = 'POST hooks.answer';

    public function __construct(private Router $router, private ClientDeclarations $declarations) {}

    /**
     * @return list<EntryPoint>
     */
    public function entries(): array
    {
        return array_map(
            fn (RouteMethod $method) => new EntryPoint(EntryType::Route, $method->entryName(), $method->testFolder()),
            $this->methods(),
        );
    }

    /**
     * Each method of every named journal route but the hook answer, with its owner: a page's is the domain that
     * declares it, any other route's the namespace of its controller.
     *
     * @return list<RouteMethod>
     */
    public function methods(): array
    {
        $methods = [];

        foreach ($this->journalRoutes() as $route) {
            foreach ($this->methodsOf($route) as $method) {
                if ($route->getName() !== null && "{$method} {$route->getName()}" !== self::HOOK_ANSWER) {
                    $methods[] = new RouteMethod($route, $method, $this->ownerOf($route));
                }
            }
        }

        return $methods;
    }

    /**
     * Each method and address of a journal route that has no name.
     *
     * @return list<string>
     */
    public function unnamed(): array
    {
        $routes = array_filter($this->journalRoutes(), fn (Route $route) => $route->getName() === null);

        return $this->methodsAndAddresses($routes);
    }

    /**
     * Each method and address of a route no journal controller answers.
     *
     * @return list<string>
     */
    public function vendor(): array
    {
        $routes = array_filter($this->router->getRoutes()->getRoutes(), fn (Route $route) => ! self::isJournal($route));

        return $this->methodsAndAddresses($routes);
    }

    /**
     * @return list<Route>
     */
    private function journalRoutes(): array
    {
        return array_values(array_filter($this->router->getRoutes()->getRoutes(), self::isJournal(...)));
    }

    /**
     * The namespace that owns the route: the declaring domain's for a page, which core's page controller answers, and
     * the controller's own for every other route.
     */
    private function ownerOf(Route $route): string
    {
        if ($route->getControllerClass() === PageController::class) {
            return $this->declarations->ownerOf(DeclaredRouteKey::of($route))->namespace;
        }

        return Str::match('/^(App|Domain\\\\[^\\\\]+)\\\\/', (string) $route->getControllerClass());
    }

    private static function isJournal(Route $route): bool
    {
        return preg_match('/^(App|Domain)\\\\/', (string) $route->getControllerClass()) === 1;
    }

    /**
     * @return list<string>
     */
    private function methodsOf(Route $route): array
    {
        return array_values(array_diff($route->methods(), ['HEAD']));
    }

    /**
     * @param  array<int, Route>  $routes
     * @return list<string>
     */
    private function methodsAndAddresses(array $routes): array
    {
        $lines = [];

        foreach ($routes as $route) {
            foreach ($this->methodsOf($route) as $method) {
                $lines[] = "{$method} {$route->uri()}";
            }
        }

        sort($lines);

        return $lines;
    }
}
