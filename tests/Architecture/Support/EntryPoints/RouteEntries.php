<?php

declare(strict_types=1);

namespace Tests\Architecture\Support\EntryPoints;

use Illuminate\Routing\Route;
use Illuminate\Routing\Router;

/**
 * Every method of every route a journal controller, of core or of a domain, answers, by its name, tested in the
 * routes folder of the controller's owner; the hook answer route is left to the hook moments. Beside them stand the
 * journal's routes that have no name and the routes of every other controller.
 */
final readonly class RouteEntries
{
    private const string HOOK_ANSWER = 'POST hooks.answer';

    public function __construct(private Router $router) {}

    /**
     * @return list<EntryPoint>
     */
    public function entries(): array
    {
        $entries = [];

        foreach ($this->journalRoutes() as $route) {
            foreach ($this->methodsOf($route) as $method) {
                $name = "{$method} {$route->getName()}";

                if ($route->getName() !== null && $name !== self::HOOK_ANSWER) {
                    $entries[] = new EntryPoint(
                        EntryType::Route,
                        $name,
                        EntryPoint::folderOf((string) $route->getControllerClass(), EntryType::Route),
                    );
                }
            }
        }

        return $entries;
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
