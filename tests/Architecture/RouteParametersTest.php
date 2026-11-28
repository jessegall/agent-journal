<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Illuminate\Routing\Router;
use Tests\Architecture\Support\RouteNameCallsScan;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * Every call that builds a named route's address, route() or a wrapper handing it a name and its parameters, supplies
 * each parameter the route's path declares, so a renamed parameter fails here and not on the wire.
 */
#[TimeLimit(seconds: 15, reason: 'It reads every PHP file of app and the domains.')]
final class RouteParametersTest extends TestCase
{
    public function test_every_named_route_call_supplies_each_parameter_its_path_declares(): void
    {
        $folders = [base_path('app'), ...glob(base_path('domain/*/src'), GLOB_ONLYDIR) ?: []];

        $this->assertSame([], $this->faultsIn($folders), 'Name each parameter as the route path declares it.');
    }

    public function test_a_call_naming_a_parameter_by_an_old_name_is_named(): void
    {
        $this->assertSame(
            ['tests/Fixtures/RouteParameters/RenamedParameterCall.php:14 builds profiles.account-host.folders.answer '
                .'without instruction'],
            $this->faultsIn([base_path('tests/Fixtures/RouteParameters')]),
        );
    }

    /**
     * @param  list<string>  $folders
     * @return list<string>
     */
    private function faultsIn(array $folders): array
    {
        $calls = array_merge([], ...array_values(ScanCache::findingsInFolders(new RouteNameCallsScan(), $folders)));
        $routes = $this->app->make(Router::class)->getRoutes();
        $faults = [];

        foreach ($calls as $call) {
            [$name, $keys, $place] = explode('|', $call, 3);
            $route = $routes->getByName($name);

            if ($route === null) {
                continue;
            }

            $optional = array_filter(
                $route->parameterNames(),
                fn (string $parameter) => str_contains($route->uri(), "{{$parameter}?}"),
            );
            $missing = array_diff($route->parameterNames(), $optional, array_filter(explode(',', $keys)));

            if ($missing !== []) {
                $faults[] = str_replace(base_path().'/', '', $place)." builds {$name} without ".implode(', ', $missing);
            }
        }

        return $faults;
    }
}
