<?php

declare(strict_types=1);

/*
 * Captures what the layout moves must keep as it is: the boots,
 * operation names, exports, installed domains, command pairs, listener lanes, migrations, Artisan signatures, ordered
 * routes and MCP names, one sorted JSON file each under tools/refactoring/layout/baseline/. Run it in the app
 * container; it fails loudly when a set that is never empty comes back empty.
 *
 *   php tools/refactoring/layout/capture-baseline.php
 */

use App\CoreApi;
use App\Mcp\Support\McpCatalogue;
use App\Providers\DomainEventServiceProvider;
use App\Support\CommandName;
use App\Support\Reflector;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Routing\Route;
use Illuminate\Routing\Router;
use Illuminate\Support\Facades\Artisan;

$root = dirname(__DIR__, 3);
$output = __DIR__.'/baseline';
require $root.'/vendor/autoload.php';

$snapshots = [];
$app = require $root.'/bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();
$snapshots['boot-normal'] = ['booted' => $app->isBooted(), 'providers' => sortedKeys($app->getLoadedProviders())];

$pairs = json_decode((string) file_get_contents(__DIR__.'/baseline-pairs.json'), true, flags: JSON_THROW_ON_ERROR)['pairs'];
$snapshots['operation-names'] = sorted(array_map(fn (array $pair) => CommandName::of($pair['command']), $pairs));
$snapshots['command-pairs'] = array_map(
    fn (array $pair) => [$pair['owner'], CommandName::of($pair['command']), $pair['command'], $pair['handler']],
    $pairs,
);

$exports = CoreApi::exports();
$snapshots['exports'] = sorted(array_map('strval', $exports->all()));
$snapshots['installed-domains'] = array_map('strval', require $root.'/bootstrap/domains.php');
$snapshots['listener-roots'] = sorted(array_map('strval', CoreApi::listenerFolders()));

$events = new DomainEventServiceProvider($app)->discoverEvents();
$lanes = [];

foreach ($events as $event => $listeners) {
    foreach ((array) $listeners as $listener) {
        $lanes[] = $event.' => '.(is_string($listener) ? $listener : json_encode($listener));
    }
}

$snapshots['listener-lanes'] = sorted($lanes);

$migrations = [];

foreach ($app->make('migrator')->paths() as $path) {
    foreach (glob($path.'/*.php') ?: [] as $file) {
        $migrations[] = basename($file);
    }
}

foreach (glob($root.'/database/migrations/*.php') ?: [] as $file) {
    $migrations[] = basename($file);
}

$snapshots['migrations'] = sorted(array_unique($migrations));
$snapshots['artisan-signatures'] = sorted(array_keys(Artisan::all()));
$snapshots['routes-normal'] = routesOf($app->make(Router::class));

$catalogue = $app->make(McpCatalogue::class);
$snapshots['mcp-tools'] = sorted(array_map(fn (string $tool) => Reflector::of($tool)->newInstanceWithoutConstructor()->name(), $catalogue->toolClasses()));
$snapshots['mcp-resources'] = sorted(array_map(
    fn (string $resource) => Reflector::of($resource)->newInstanceWithoutConstructor()->uri(),
    $catalogue->resourceClasses(),
));

$sharing = require $root.'/bootstrap/sharing.php';
$sharing->make(Kernel::class)->bootstrap();
$snapshots['boot-sharing'] = ['booted' => $sharing->isBooted(), 'providers' => sortedKeys($sharing->getLoadedProviders())];
$snapshots['routes-sharing'] = routesOf($sharing->make(Router::class));

$expected = [
    'tasks_create' => in_array('tasks_create', $snapshots['mcp-tools'], true),
    'docs_create' => in_array('docs_create', $snapshots['mcp-tools'], true),
    'journal://v1/reports/{id}' => in_array('journal://v1/reports/{id}', $snapshots['mcp-resources'], true),
];
$failures = array_keys(array_filter($expected, fn (bool $isFound) => ! $isFound));

foreach ($snapshots as $name => $snapshot) {
    if ($snapshot === [] || (isset($snapshot['providers']) && $snapshot['providers'] === [])) {
        $failures[] = "{$name} is empty";
    }
}

if ($failures !== []) {
    fwrite(STDERR, 'The baseline is incomplete: '.implode(', ', $failures).".\n");
    exit(1);
}

is_dir($output) || mkdir($output, 0777, true);

foreach ($snapshots as $name => $snapshot) {
    file_put_contents("{$output}/{$name}.json", json_encode($snapshot, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)."\n");
    echo "{$name}: ".count($snapshot)."\n";
}

/**
 * Each route in registration order with its methods, URI, name, action and middleware.
 *
 * @return list<array<string, mixed>>
 */
function routesOf(Router $router): array
{
    return array_map(fn (Route $route) => [
        'methods' => $route->methods(),
        'uri' => $route->uri(),
        'name' => $route->getName(),
        'action' => $route->getActionName(),
        'middleware' => $route->gatherMiddleware(),
    ], array_values($router->getRoutes()->getRoutes()));
}

/**
 * @param  array<array-key, mixed>  $values
 * @return list<string>
 */
function sorted(array $values): array
{
    $values = array_values(array_map('strval', $values));
    sort($values);

    return $values;
}

/**
 * @param  array<string, mixed>  $values
 * @return list<string>
 */
function sortedKeys(array $values): array
{
    return sorted(array_keys($values));
}
