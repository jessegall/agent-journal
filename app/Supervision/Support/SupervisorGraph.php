<?php

declare(strict_types=1);

namespace App\Supervision\Support;

use App\Profiles\Values\AskTypeKey;
use App\Profiles\Values\SupervisorRoutes;
use App\Supervision\Exceptions\SupervisorRouteRefused;

final readonly class SupervisorGraph
{
    private const int MAX_HOPS = 32;

    /**
     * @param  array<string, SupervisorRoutes>  $routes
     */
    public function __construct(private array $routes) {}

    /**
     * @param  list<AskTypeKey>  $types
     */
    public function requireAcyclic(array $types): void
    {
        foreach ([null, ...$types] as $type) {
            foreach (array_keys($this->routes) as $source) {
                $this->follow($source, $type);
            }
        }
    }

    private function follow(string $start, AskTypeKey|null $type): void
    {
        $source = $start;
        $path = [];
        $route = AskTypeKey::routeOf($type);

        while (isset($this->routes[$source])) {
            if (isset($path[$source])) {
                throw SupervisorRouteRefused::cycle($route, [...array_keys($path), $source]);
            }

            if (count($path) === self::MAX_HOPS) {
                throw SupervisorRouteRefused::tooDeep($route, [...array_keys($path), $source]);
            }

            $path[$source] = true;
            $routes = $this->routes[$source];
            $source = ($type === null ? $routes->default : $routes->targetFor($type))->key;
        }
    }
}
