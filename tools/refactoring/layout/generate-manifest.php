<?php

declare(strict_types=1);

/*
 * Writes the move manifest of one scope (core, or a package name such as Tasks) from doc 107 revision 3: one row per
 * tracked file with its old and final path and class, whether it moves, stays or is generated, and its kind. The
 * destination key is data in layout-rules.json; reviewed decisions are in overrides-<scope>.json.
 *
 *   php tools/refactoring/layout/generate-manifest.php core
 *   php tools/refactoring/layout/generate-manifest.php Tasks
 *   php tools/refactoring/layout/generate-manifest.php core --move-list   (prints Old New lines for move.php)
 */

$root = dirname(__DIR__, 3);
$scope = $argv[1] ?? '';
$asMoveList = in_array('--move-list', $argv, true);

if ($scope === '') {
    fwrite(STDERR, "Name a scope: core, or a package name such as Tasks.\n");
    exit(2);
}

$rules = readJson(__DIR__.'/layout-rules.json');
$overrides = is_file(__DIR__."/overrides-{$scope}.json") ? readJson(__DIR__."/overrides-{$scope}.json") : [];
$revision = trim(run($root, 'git rev-parse HEAD'));
$isCore = $scope === 'core';

if (! $isCore && ! is_dir("{$root}/domain/{$scope}/src")) {
    fwrite(STDERR, "No package domain/{$scope}/src exists.\n");
    exit(2);
}

$paths = $isCore
    ? ['app']
    : ["domain/{$scope}/src", "domain/{$scope}/routes", "domain/{$scope}/database", "domain/{$scope}/resources"];
$files = array_values(array_filter(
    explode("\n", trim(run($root, 'git ls-files -- '.implode(' ', array_map('escapeshellarg', $paths))))),
    fn (string $file) => $file !== '',
));
sort($files);
// The blobs of the files as they are now, so the applier compares like with like; one git process hashes them all.
$pathList = (string) tempnam(sys_get_temp_dir(), 'layout-paths-');
file_put_contents($pathList, implode("\n", $files)."\n");
$blobs = array_combine($files, explode("\n", trim(run($root, 'git hash-object --stdin-paths < '.escapeshellarg($pathList)))));
unlink($pathList);

$rows = [];

foreach ($files as $old) {
    $kind = kindOf($root, $old);
    $new = $overrides['paths'][$old] ?? compositionTraitPlace(destinationOf($old, $scope, $rules), $root, $old, $kind, $rules);
    $rows[] = [
        'revision' => $revision,
        'blob' => $blobs[$old],
        'old_path' => $old,
        'old_class' => classOf($root, $old, $kind),
        'final_path' => $new,
        'final_class' => classOfPath($new, $kind, $root, $old),
        'status' => isGenerated($root, $old) ? 'generate' : ($new === $old ? 'stay' : 'move'),
        'kind' => $kind,
        'generator' => ['input' => null, 'output' => null],
        'phase' => phaseOf($new, $rules),
        'batch' => batchOf($old, $scope),
        'consumers' => [],
        'ownership_checks' => [],
        'detector_dependencies' => [],
    ];
}

$rows = withOutsideConsumers($root, $rows, $rules, $scope);

if ($asMoveList) {
    foreach ($rows as $row) {
        if ($row['status'] === 'move' && $row['old_class'] !== null && $row['final_class'] !== null) {
            echo $row['old_class'].' '.$row['final_class']."\n";
        }
    }

    exit(0);
}

$output = __DIR__."/manifest-{$scope}.json";
file_put_contents($output, json_encode($rows, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR)."\n");
$moves = count(array_filter($rows, fn (array $row) => $row['status'] === 'move'));
echo count($rows)." rows, {$moves} moves, written to ".substr($output, strlen($root) + 1)."\n";

/**
 * The final path of one tracked file by the destination key.
 *
 * @param  array<string, mixed>  $rules
 */
function destinationOf(string $old, string $scope, array $rules): string
{
    if ($scope === 'core') {
        $relative = substr($old, strlen('app/'));
        $segments = explode('/', $relative);

        if (count($segments) === 1) {
            return $old;
        }

        $top = $segments[0];

        // A class in a role folder (app/Values/Operation.php, app/Data/Agents/UsageReportData.php) is already where
        // the layout wants it; Pipelines and Contracts were areas too, so only their direct files count.
        $roleRoot = in_array($top, [...$rules['kind_roots'], 'Support', 'Concerns'], true);

        if ($roleRoot && (count($segments) === 2 || ! in_array($top, ['Pipelines', 'Contracts'], true))) {
            return $old;
        }

        if (in_array($top, $rules['core_flat_roots'], true)) {
            return 'app/'.(mapInArea(null, $relative, $rules, 'app') ?? $relative);
        }

        $inArea = implode('/', array_slice($segments, 1));

        return mapAreaFile($top, $inArea, $rules, 'app', 'routes/'.strtolower($top), 'database', 'resources');
    }

    $base = "domain/{$scope}/src";

    if (! str_starts_with($old, $base.'/')) {
        return $old;
    }

    $inArea = substr($old, strlen($base) + 1);

    if (! str_contains($inArea, '/')) {
        return $old;
    }

    $first = explode('/', $inArea)[0];

    if (in_array($first, $rules['package_kept_roots'][$scope] ?? [], true)) {
        return $old;
    }

    if (isset($rules['package_role_folders'][$first])) {
        return $base.'/'.packageRolePath($first, substr($inArea, strlen($first) + 1), (string) file_get_contents($old));
    }

    return mapAreaFile($scope, $inArea, $rules, $base, "domain/{$scope}/routes", "domain/{$scope}/database", "domain/{$scope}/resources");
}

/**
 * Where a file of a package's public Api or Mcp folder goes by what it declares: an Api event to Events, a contract to
 * Contracts, an enum to Enums, a Data class to Data, an immutable value to Values, a service to Support; an MCP tool
 * to Mcp/Tools, a resource to Mcp/Resources, anything else of Mcp to Support/Mcp.
 */
function packageRolePath(string $folder, string $rest, string $source): string
{
    if ($folder === 'Mcp') {
        return match (true) {
            str_starts_with($rest, 'Tools/'), str_starts_with($rest, 'Resources/') => "Mcp/{$rest}",
            preg_match('/\bclass \w+ extends \w*Tool\b/', $source) === 1 => "Mcp/Tools/{$rest}",
            preg_match('/\bclass \w+ extends \w*Resource\b/', $source) === 1 => "Mcp/Resources/{$rest}",
            default => "Support/Mcp/{$rest}",
        };
    }

    if (str_starts_with($rest, 'Events/')) {
        return $rest;
    }

    $isValue = preg_match('/^final readonly class \w+/m', $source) === 1
        && preg_match('/->save\(|::query\(|CommandBus/', $source) !== 1;

    return match (true) {
        preg_match('/^interface \w+/m', $source) === 1 => "Contracts/{$rest}",
        preg_match('/^enum \w+/m', $source) === 1 => "Enums/{$rest}",
        preg_match('/\bclass \w+ extends Data\b/', $source) === 1 => "Data/{$rest}",
        $isValue => "Values/{$rest}",
        default => "Support/{$rest}",
    };
}

/**
 * Where a file of an area goes, for an area's own path within it.
 *
 * @param  array<string, mixed>  $rules
 */
function mapAreaFile(
    string $area,
    string $inArea,
    array $rules,
    string $base,
    string $routes,
    string $database,
    string $resources,
): string {
    foreach ($rules['area_roots'] as $from => $to) {
        if ("{$area}/{$inArea}" === $from || str_starts_with("{$area}/{$inArea}", $from.'/')) {
            return $base.'/'.$to.substr("{$area}/{$inArea}", strlen($from));
        }
    }

    foreach ($rules['assets'] as $from => $to) {
        $areaPath = str_contains($from, '/') && ! str_starts_with($from, 'Resources/') ? "{$area}/{$inArea}" : $inArea;

        if ($areaPath === $from || str_starts_with($areaPath, $from.'/')) {
            $target = str_replace('{area}', strtolower($area), $to);
            $target = $base === 'app' ? $target : $resources.substr($target, strlen('resources'));

            return $target.substr($areaPath, strlen($from));
        }
    }

    foreach ($rules['repository_roots'] as $from => $to) {
        if (str_starts_with($inArea, $from.'/')) {
            return $database.substr($to, strlen('database')).substr($inArea, strlen($from));
        }
    }

    if (str_starts_with($inArea, $rules['routes_root'].'/')) {
        return $routes.substr($inArea, strlen($rules['routes_root']));
    }

    return $base.'/'.(mapInArea($area, $inArea, $rules, $base) ?? specialist($inArea, $rules));
}

/**
 * The role path of a file by the kind keys, or null when only the specialist fallback applies.
 *
 * @param  array<string, mixed>  $rules
 */
function mapInArea(string|null $area, string $inArea, array $rules, string $base): string|null
{
    $segments = explode('/', $inArea);

    if (count($segments) === 1) {
        return $area === null ? $inArea : 'Support/'.$inArea;
    }

    $renamed = $rules['renamed_roots'];

    foreach ([2, 1] as $depth) {
        $prefix = implode('/', array_slice($segments, 0, $depth));

        if (count($segments) > $depth && isset($renamed[$prefix])) {
            return $renamed[$prefix].'/'.implode('/', array_slice($segments, $depth));
        }
    }

    if (in_array($segments[0], $rules['kind_roots'], true) || in_array($segments[0], $rules['paired_roots'], true)) {
        return $inArea;
    }

    if (in_array($segments[0], $rules['grouped_roots'], true)) {
        return $area === null || $base !== 'app' ? $inArea : $segments[0].'/'.$area.'/'.implode('/', array_slice($segments, 1));
    }

    return $area === null ? $inArea : null;
}

/**
 * @param  array<string, mixed>  $rules
 */
function specialist(string $inArea, array $rules): string
{
    $segments = explode('/', $inArea);

    return str_replace('{kind}', $segments[0], $rules['specialist_fallback']).'/'.implode('/', array_slice($segments, 1));
}

/**
 * A general composition trait the key sends to Support goes to Concerns instead (doc 107, Placement decisions).
 *
 * @param  array<string, mixed>  $rules
 */
function compositionTraitPlace(string $new, string $root, string $old, string $kind, array $rules): string
{
    if ($kind !== 'class' || preg_match('/^trait \w+/m', (string) file_get_contents("{$root}/{$old}")) !== 1) {
        return $new;
    }

    foreach ($rules['composition_trait_roots'] as $from) {
        if (preg_match('#^(app|domain/\w+/src)/'.preg_quote($from, '#').'/([^/]+\.php)$#', $new, $match) === 1) {
            return "{$match[1]}/{$rules['composition_trait_destination']}/{$match[2]}";
        }
    }

    return $new;
}

/**
 * Phase 4 moves registration and assets; phase 3 the contracts, values, models, events, policies and their support.
 *
 * @param  array<string, mixed>  $rules
 */
function phaseOf(string $new, array $rules): int
{
    if (! preg_match('#^(app|domain/\w+/src)/([^/]+)/#', $new, $match)) {
        return 4;
    }

    return in_array($match[2], $rules['phase_four_roots'], true) ? 4 : 3;
}

/**
 * The batch a row moves in: its old area for Core, the package itself for a package.
 */
function batchOf(string $old, string $scope): string
{
    if ($scope !== 'core') {
        return $scope;
    }

    $segments = explode('/', $old);

    return count($segments) > 2 ? $segments[1] : 'root';
}

/**
 * Lists, per moving row, the files outside the PHP roots that name its old path or class, such as config, docs,
 * tools and Vue files, read once for all rows.
 *
 * @param  list<array<string, mixed>>  $rows
 * @param  array<string, mixed>  $rules
 * @return list<array<string, mixed>>
 */
function withOutsideConsumers(string $root, array $rows, array $rules, string $scope): array
{
    // A package's consumers are everything outside its own src, Core included; Core's are outside the PHP roots.
    $outsideRoots = $scope === 'core' ? $rules['outside_consumer_roots'] : [...$rules['outside_consumer_roots'], 'app'];
    $listing = run($root, 'git ls-files -- '.implode(' ', array_map('escapeshellarg', $outsideRoots)));
    $own = $scope === 'core' ? '#^domain/\w+/src/#' : '#^domain/'.preg_quote($scope, '#').'/src/#';
    $texts = [];

    foreach (array_filter(explode("\n", $listing)) as $file) {
        if (preg_match($own, $file) === 1 || ! is_file("{$root}/{$file}") || filesize("{$root}/{$file}") > 2_000_000) {
            continue;
        }

        $texts[$file] = (string) file_get_contents("{$root}/{$file}");
    }

    foreach ($rows as &$row) {
        if ($row['status'] !== 'move') {
            continue;
        }

        $needles = array_filter([$row['old_path'], $row['old_class'] === null ? null : str_replace('\\', '\\\\', $row['old_class']), $row['old_class']]);

        foreach ($texts as $file => $text) {
            foreach ($needles as $needle) {
                if (str_contains($text, $needle)) {
                    $row['consumers'][] = $file;

                    break;
                }
            }
        }
    }

    return $rows;
}

function kindOf(string $root, string $path): string
{
    if (str_ends_with($path, '.vue') || str_ends_with($path, '.ts')) {
        return 'vue/ts';
    }

    if (str_ends_with($path, '.blade.php') || ! str_ends_with($path, '.php')) {
        return 'blade or static asset';
    }

    $source = (string) file_get_contents("{$root}/{$path}");

    if (str_contains($path, '/Migrations/') || str_contains($path, '/migrations/')) {
        return preg_match('/return new class/', $source) === 1 ? 'anonymous migration' : 'class';
    }

    if (str_contains($path, '/Seeders/') || str_contains($path, '/seeders/')) {
        return 'seeder';
    }

    if (preg_match('/^\s*(?:final\s+|abstract\s+|readonly\s+)*(?:class|interface|trait|enum)\s+\w+/m', $source) === 1) {
        return 'class';
    }

    return 'route script';
}

function classOf(string $root, string $path, string $kind): string|null
{
    if (! in_array($kind, ['class', 'seeder'], true)) {
        return null;
    }

    $source = (string) file_get_contents("{$root}/{$path}");

    if (preg_match('/^namespace\s+([^;]+);/m', $source, $namespace) !== 1) {
        return null;
    }

    return $namespace[1].'\\'.basename($path, '.php');
}

function classOfPath(string $path, string $kind, string $root, string $old): string|null
{
    if (! in_array($kind, ['class', 'seeder'], true)) {
        return null;
    }

    $stem = substr($path, 0, -strlen('.php'));

    if (str_starts_with($stem, 'app/')) {
        return 'App\\'.str_replace('/', '\\', substr($stem, 4));
    }

    if (preg_match('#^domain/(\w+)/src/(.+)$#', $stem, $match) === 1) {
        return "Domain\\{$match[1]}\\".str_replace('/', '\\', $match[2]);
    }

    if (str_starts_with($stem, 'database/seeders/')) {
        return 'Database\\Seeders\\'.str_replace('/', '\\', substr($stem, strlen('database/seeders/')));
    }

    return classOf($root, $old, $kind);
}

function isGenerated(string $root, string $path): bool
{
    $head = (string) file_get_contents("{$root}/{$path}", length: 600);

    return str_contains($path, '/generated/') || preg_match('/auto-generated|@generated|Generated by/i', $head) === 1;
}

/**
 * @return array<string, mixed>
 */
function readJson(string $path): array
{
    return json_decode((string) file_get_contents($path), true, flags: JSON_THROW_ON_ERROR);
}

function run(string $root, string $command): string
{
    return (string) shell_exec('cd '.escapeshellarg($root).' && '.$command);
}
