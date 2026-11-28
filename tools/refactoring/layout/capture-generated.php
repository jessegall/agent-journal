<?php

declare(strict_types=1);

/*
 * Captures the generators' outputs the layout moves must reproduce: each generated file's hash, each TypeScript module's
 * exports, the client's call groups and the type-owner rows. Run the generators first; it fails on a class listed twice
 * or two exports of one name.
 *
 *   php tools/refactoring/layout/capture-generated.php
 */

$root = dirname(__DIR__, 3);
$output = __DIR__.'/baseline';
$generatedRoots = [
    'resources/js/actions',
    'resources/js/routes',
    'resources/js/wayfinder',
    'resources/js/generated',
    'resources/js/types/generated',
    'resources/css/generated',
];
$files = [];

foreach ($generatedRoots as $folder) {
    if (! is_dir("{$root}/{$folder}")) {
        continue;
    }

    foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator("{$root}/{$folder}", FilesystemIterator::SKIP_DOTS)) as $entry) {
        $files[substr($entry->getPathname(), strlen($root) + 1)] = hash_file('sha256', $entry->getPathname());
    }
}

ksort($files);
$exports = [];
$failures = [];

foreach (array_keys($files) as $file) {
    if (! str_ends_with($file, '.ts')) {
        continue;
    }

    preg_match_all('/^export (?:declare )?(?:type|interface|const|function|enum|class) (\w+)/m', (string) file_get_contents("{$root}/{$file}"), $names);

    foreach (array_count_values($names[1]) as $name => $count) {
        if ($count > 1) {
            $failures[] = "{$file} exports {$name} {$count} times";
        }
    }

    if ($names[1] !== []) {
        $exports[$file] = array_values(array_unique($names[1]));
        sort($exports[$file]);
    }
}

$client = [];
$callFiles = explode("\n", trim((string) shell_exec('cd '.escapeshellarg($root).' && git grep -l "journal:api" -- app domain')));

foreach (array_filter($callFiles) as $file) {
    preg_match_all('/public function (\w+)\(/', (string) file_get_contents("{$root}/{$file}"), $methods);
    $client[$file] = [
        'hash' => hash_file('sha256', "{$root}/{$file}"),
        'methods' => $methods[1],
    ];
}

ksort($client);
$typeOwners = json_decode((string) file_get_contents("{$root}/resources/js/generated/type-owners.json"), true, flags: JSON_THROW_ON_ERROR);

foreach (array_count_values(array_column($typeOwners, 'class')) as $class => $count) {
    if ($count > 1) {
        $failures[] = "{$class} is listed {$count} times in the type owners";
    }
}

foreach ([
    $files,
    $exports,
    $client,
    $typeOwners,
] as $index => $set) {
    if ($set === []) {
        $failures[] = [
            'generated files',
            'exports',
            'client calls',
            'type owners',
        ][$index].' came back empty';
    }
}

if ($failures !== []) {
    fwrite(STDERR, "The generated baseline is not sound:\n- ".implode("\n- ", $failures)."\n");
    exit(1);
}

is_dir($output) || mkdir($output, 0777, true);
$snapshots = [
    'generated-files' => $files,
    'generated-exports' => $exports,
    'generated-client' => $client,
    'type-owners' => $typeOwners,
];

foreach ($snapshots as $name => $snapshot) {
    file_put_contents("{$output}/{$name}.json", json_encode($snapshot, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)."\n");
    echo "{$name}: ".count($snapshot)."\n";
}
