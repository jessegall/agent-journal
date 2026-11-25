<?php

declare(strict_types=1);

/**
 * Keeps one entry test file for every route method and MCP tool. With no option it lists what is missing and the
 * orphaned files, whose entry no longer exists, and writes nothing; --write writes each missing file and never opens
 * one that is there; --prune deletes each orphaned file the generator wrote and lists the ones filled in by hand.
 *
 *   php -d memory_limit=1G tests/bin/entry-tests.php [--write | --prune], in the app container
 */

use App\Contracts\Files\Files;
use App\Enums\Files\Permissions;
use App\Enums\Files\Place;
use App\Mcp\Support\McpCatalogue;
use App\Support\ClientDeclarations;
use App\Values\FilePath;
use Illuminate\Contracts\Console\Kernel;
use Illuminate\Routing\Router;
use Tests\Architecture\Support\EntryPoints\EntryAttributes;
use Tests\Architecture\Support\EntryPoints\EntryTestFile;
use Tests\Architecture\Support\EntryPoints\EntryTestFiles;
use Tests\Architecture\Support\EntryPoints\EntryType;
use Tests\Architecture\Support\EntryPoints\NamedEntry;
use Tests\Architecture\Support\EntryPoints\RouteEntries;

require __DIR__.'/../../vendor/autoload.php';

$app = require __DIR__.'/../../bootstrap/app.php';
$app->make(Kernel::class)->bootstrap();

$files = $app->make(Files::class);
$mode = $argv[1] ?? '';
$router = $app->make(Router::class);
$expected = new EntryTestFiles(
    new RouteEntries($router, $app->make(ClientDeclarations::class)),
    $router,
    $app->make(McpCatalogue::class),
    $files,
)->all();
$named = array_values(array_filter(
    new EntryAttributes(base_path())->named(),
    fn (NamedEntry $entry) => $entry->type === EntryType::Route || $entry->type === EntryType::McpTool,
));
$missing = array_filter(
    $expected,
    fn (EntryTestFile $file) => array_filter($named, $file->isFor(...)) === [],
);
$orphans = array_filter(
    $named,
    fn (NamedEntry $entry) => array_filter($expected, fn (EntryTestFile $file) => $file->isFor($entry)) === [],
);

foreach ($missing as $file) {
    $path = FilePath::in(Place::Project, $file->path);

    if ($mode !== '--write') {
        echo "missing {$file->entry}: {$file->path}\n";
    } elseif ($files->exists($path)) {
        echo "taken {$file->path}: it names another entry, so {$file->entry} is not written\n";
    } else {
        if (! $files->isFolder($path->parent())) {
            $files->makeFolder($path->parent(), Permissions::Shared);
        }

        $files->write($path, $file->text);
        echo "wrote {$file->path}\n";
    }
}

foreach ($orphans as $entry) {
    $path = FilePath::in(Place::Project, $entry->file);
    $isGenerated = str_contains($files->read($path), '#[Generated]');

    if ($mode === '--prune' && $isGenerated) {
        $files->delete($path);
        echo "deleted {$entry->file}: {$entry->name} no longer exists\n";
    } else {
        $kind = $isGenerated ? 'as generated' : 'filled in, so delete or rename it by hand';
        echo "orphaned {$entry->file}: {$entry->name} no longer exists ({$kind})\n";
    }
}
