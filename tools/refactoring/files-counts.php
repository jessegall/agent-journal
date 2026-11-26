<?php

declare(strict_types=1);

/**
 * Prints what the Files funnel does for repeated reads, as counts and never as times: opens and fingerprint stats for
 * 1000 reads of one unchanged file, whether a file past the per-file limit is kept, the bytes kept after reading many
 * files, and the levels a deep list walks. It builds a Files over a temporary folder of its own.
 *
 *   php tools/refactoring/files-counts.php
 *
 * Opens are counted by Files::readCount. Each read takes exactly one fingerprint, one stat of the file, so the stat
 * count is the number of fingerprints taken; PHP has no counter of its own for the stat calls realpath makes.
 */

use App\Enums\Files\Place;
use App\Exceptions\DepthTooDeep;
use App\Support\ClosedFolders;
use App\Support\CodeFiles;
use App\Support\FileContents;
use App\Support\Files;
use App\Support\FileWriter;
use App\Support\FolderWalker;
use App\Support\PathConfinement;
use App\Support\PlaceRoots;
use App\Values\Depth;
use App\Values\FilePath;
use Illuminate\Config\Repository;
use Illuminate\Filesystem\Filesystem;

$root = dirname(__DIR__, 2);

require $root.'/vendor/autoload.php';

const CACHED_BYTES = 32 * 1024 * 1024;

const LARGEST_CACHED_FILE = 1024 * 1024;

$folder = sys_get_temp_dir().'/files-counts-'.bin2hex(random_bytes(6));
mkdir("{$folder}/many", 0o700, true);
file_put_contents("{$folder}/unchanged.json", str_repeat('x', 50 * 1024));
file_put_contents("{$folder}/large.log", str_repeat('x', 2 * 1024 * 1024));

foreach (range(1, 200) as $number) {
    file_put_contents("{$folder}/many/{$number}.txt", str_repeat('x', 10 * 1024));
}

mkdir($folder.'/deep/'.implode('/', array_map(fn (int $level) => "level-{$level}", range(1, 17))), 0o700, true);

// A file changed within the last second is never kept, so the files settle first.
sleep(2);

$config = new Repository(['files' => [
    'places' => ['project' => $folder, 'temporary' => $folder],
    'cached_bytes' => CACHED_BYTES,
    'largest_cached_file' => LARGEST_CACHED_FILE,
]]);
$roots = new PlaceRoots($config);
$closed = new ClosedFolders($roots);
$confinement = new PathConfinement($roots, $closed);
$contents = new FileContents(CACHED_BYTES, LARGEST_CACHED_FILE);
$walker = new FolderWalker($roots, $closed, $confinement);
$files = new Files($roots, $confinement, $contents, $walker, CodeFiles::over($folder), new FileWriter());

$unchanged = FilePath::in(Place::Project, 'unchanged.json');

foreach (range(1, 1000) as $read) {
    $files->read($unchanged);
}

$large = FilePath::in(Place::Project, 'large.log');
$files->read($large);
$files->read($large);
$keptBefore = $contents->keptBytes();

foreach (range(1, 200) as $number) {
    $files->read(FilePath::in(Place::Project, "many/{$number}.txt"));
}

$walked = $files->list(FilePath::in(Place::Project, 'deep'), Depth::levels(16));

try {
    $files->list(FilePath::in(Place::Project, 'deep'), Depth::levels(17));
    $refused = 'no';
} catch (DepthTooDeep) {
    $refused = 'yes, before any read';
}

$deepest = max(array_map(fn (FilePath $path) => substr_count($path->relative, '/'), $walked->paths()));

echo 'Ran with cached_bytes '.CACHED_BYTES.', largest_cached_file '.LARGEST_CACHED_FILE.', depth limit '.Depth::LEVEL_LIMIT."\n";
echo "1000 reads of an unchanged 50 KB file: {$files->readCount($unchanged)} open, 1000 fingerprint stats\n";
echo "2 MiB file read twice: {$files->readCount($large)} opens, kept: ".($keptBefore === 50 * 1024 ? 'no' : 'yes')."\n";
echo '200 reads of 200 different 10 KB files: '.$contents->keptBytes().' bytes kept, under cached_bytes: '.($contents->keptBytes() <= CACHED_BYTES ? 'yes' : 'no')."\n";
echo "A list of a tree 17 deep at Depth::levels(16): {$walked->count()} entries, {$deepest} levels walked\n";
echo "Depth::levels(17) refused: {$refused}\n";

new Filesystem()->deleteDirectory($folder);
