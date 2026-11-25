<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\EntryType;
use App\Exceptions\FilePathInvalid;
use App\Exceptions\FileUnreadable;
use App\Exceptions\FolderLoop;
use App\Values\Depth;
use App\Values\FilePath;
use App\Values\Fingerprint;
use App\Values\FolderEntries;
use App\Values\FolderEntry;
use App\Values\WalkStep;

/**
 * Lists a folder no deeper than asked and expands a pattern one level per '*': links are listed and never entered,
 * closed folders are left out, and a folder entered twice is refused.
 */
final readonly class FolderWalker
{
    public function __construct(
        private PlaceRoots $roots,
        private ClosedFolders $closed,
        private PathConfinement $confinement,
    ) {}

    /**
     * The entries of a folder, down to the depth asked, whose names match the pattern within one name.
     */
    public function walk(FilePath $folder, Depth $depth, string $pattern): FolderEntries
    {
        $closed = $this->closed->closedIn($folder->place);
        $waiting = [new WalkStep($folder, $this->confinement->resolvedFolder($folder), $depth->levels)];
        $entered = [];
        $entries = [];

        while ($waiting !== []) {
            $step = array_shift($waiting);
            $entered = $this->entering($step, $entered);

            foreach ($this->namesIn($step->path, $step->realPath) as $name) {
                $entry = $this->entry($step->path->child($name), "{$step->realPath}/{$name}");

                if (in_array($entry->path->relative, $closed, true)) {
                    continue;
                }

                if (fnmatch($pattern, $name)) {
                    $entries[] = $entry;
                }

                if ($entry->isFolder() && $step->levels > 1) {
                    $waiting[] = new WalkStep($entry->path, "{$step->realPath}/{$name}", $step->levels - 1);
                }
            }
        }

        return FolderEntries::sorted($entries);
    }

    /**
     * The entries a pattern names, each '*' matching within one name as glob does, so a pattern's depth is its
     * number of names; '**' is refused.
     */
    public function expand(FilePath $pattern): FolderEntries
    {
        $names = $pattern->relative === '' ? [] : explode('/', $pattern->relative);

        if (in_array('**', $names, true)) {
            throw FilePathInvalid::recursivePattern($pattern->relative);
        }

        $closed = $this->closed->closedIn($pattern->place);
        $place = FilePath::in($pattern->place, '');
        $found = [new WalkStep($place, $this->roots->root($pattern->place), count($names))];

        foreach ($names as $segment) {
            $next = [];

            foreach ($found as $step) {
                if (is_link($step->realPath) || ! is_dir($step->realPath)) {
                    continue;
                }

                foreach ($this->namesMatching($step, $segment) as $name) {
                    $path = $step->path->child($name);

                    if (! in_array($path->relative, $closed, true)) {
                        $next[] = new WalkStep($path, "{$step->realPath}/{$name}", $step->levels - 1);
                    }
                }
            }

            $found = $next;
        }

        return FolderEntries::sorted(
            array_map(fn (WalkStep $step) => $this->entry($step->path, $step->realPath), $found),
        );
    }

    /**
     * The folders entered so far with this step's folder added, refused when its device and inode were entered
     * already.
     *
     * @param  array<string, true>  $entered
     * @return array<string, true>
     */
    private function entering(WalkStep $step, array $entered): array
    {
        $stat = @stat($step->realPath);

        if ($stat === false) {
            throw FileUnreadable::at($step->path->label());
        }

        $identity = "{$stat['dev']}:{$stat['ino']}";

        if (isset($entered[$identity])) {
            throw FolderLoop::at($step->path->label());
        }

        return [
            ...$entered,
            $identity => true,
        ];
    }

    /**
     * The names in a folder, without '.' and '..', sorted.
     *
     * @return list<string>
     */
    private function namesIn(FilePath $folder, string $realPath): array
    {
        $names = @scandir($realPath);

        if ($names === false) {
            throw FileUnreadable::at($folder->label());
        }

        return array_values(array_diff($names, [
            '.',
            '..',
        ]));
    }

    /**
     * @return list<string>
     */
    private function namesMatching(WalkStep $step, string $segment): array
    {
        if (strpbrk($segment, '*?[') === false) {
            $path = "{$step->realPath}/{$segment}";

            if (file_exists($path) || is_link($path)) {
                return [$segment];
            }

            return [];
        }

        return array_values(array_filter(
            $this->namesIn($step->path, $step->realPath),
            fn (string $name) => fnmatch($segment, $name, FNM_PERIOD),
        ));
    }

    private function entry(FilePath $path, string $realPath): FolderEntry
    {
        $type = EntryType::at($realPath);

        $fingerprint = $type === EntryType::Link
            ? Fingerprint::ofLink($path, $realPath)
            : Fingerprint::of($path, $realPath);

        return new FolderEntry($path, $type, $fingerprint);
    }
}
