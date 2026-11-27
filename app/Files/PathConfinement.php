<?php

declare(strict_types=1);

namespace App\Files;

use App\Exceptions\FileMissing;
use App\Exceptions\FileUnreadable;
use App\Exceptions\FolderMissing;
use App\Navigation\Exceptions\LinkLeavesPlace;
use App\Navigation\Exceptions\LinkLoop;
use App\Values\FilePath;
use SensitiveParameter;

/**
 * The real path of a file path, kept inside its place: no closed folder, no link out of the place, no link loop, and
 * an opened file that is the one checked.
 */
final readonly class PathConfinement
{
    /**
     * The most links one path may pass through, as Linux's own limit.
     */
    public const int LINK_LIMIT = 40;

    public function __construct(private PlaceRoots $roots, private ClosedFolders $closed) {}

    /**
     * The real path of an existing file or folder; a link inside the place is followed.
     */
    public function resolved(FilePath $file): string
    {
        return $this->existingRealPath($file) ?? throw $this->missing($file, FileMissing::at($file->label()));
    }

    /**
     * The real path of what is at a path, none when nothing is; a link out of the place is still refused.
     */
    public function existingRealPath(FilePath $file): string|null
    {
        $this->closed->assertNotClosed($file);
        $root = $this->roots->root($file->place);
        $real = $this->freshRealPath($root, $file);

        if ($real === null) {
            return null;
        }

        return $this->confined($file, $root, $real);
    }

    /**
     * The real path of an existing folder; FolderMissing when nothing, or a file, is there.
     */
    public function resolvedFolder(FilePath $folder): string
    {
        $real = $this->existingRealPath($folder) ?? throw $this->missing($folder, FolderMissing::at($folder->label()));

        if (! is_dir($real)) {
            throw FolderMissing::at($folder->label());
        }

        return $real;
    }

    /**
     * The real path a file will be written at, whether or not it exists: its nearest existing folder must lie inside
     * the place, so no byte is written through a link that leaves it.
     */
    public function resolvedForWrite(FilePath $file): string
    {
        $this->closed->assertNotClosed($file);
        $root = $this->roots->root($file->place);
        $existing = $this->absolutePath($root, $file);
        $missing = [];
        clearstatcache(true, $existing);

        while (! file_exists($existing) && ! is_link($existing)) {
            array_unshift($missing, basename($existing));
            $existing = dirname($existing);
        }

        $real = realpath($existing);

        if ($real === false) {
            throw LinkLeavesPlace::from($file->label());
        }

        $confined = $this->confined($file, $root, $real);

        if ($missing === []) {
            return $confined;
        }

        return $this->confined($file, $root, $confined.'/'.implode('/', $missing));
    }

    /**
     * The path of the entry itself, its folder confined to the place and its last name not followed, so a link is
     * moved or removed as the link, never its target.
     */
    public function entryPath(FilePath $file): string
    {
        $this->closed->assertNotClosed($file);
        $path = $this->resolvedForWrite($file->parent()).'/'.$file->name();
        clearstatcache(true, $path);

        return $path;
    }

    /**
     * The opened file at a resolved real path, refused when the file was swapped for a link or another file after
     * it was checked.
     *
     * @return resource
     */
    public function opened(FilePath $file, #[SensitiveParameter] string $real, string $mode)
    {
        clearstatcache(true, $real);
        $checked = @lstat($real);

        if ($checked === false) {
            throw FileMissing::at($file->label());
        }

        if (is_link($real)) {
            throw LinkLeavesPlace::from($file->label());
        }

        if (! is_file($real)) {
            throw FileUnreadable::at($file->label());
        }

        $handle = @fopen($real, $mode);

        if ($handle === false) {
            throw FileUnreadable::at($file->label());
        }

        $opened = fstat($handle);

        if ($opened === false || $opened['ino'] !== $checked['ino'] || $opened['dev'] !== $checked['dev']) {
            fclose($handle);

            throw LinkLeavesPlace::from($file->label());
        }

        return $handle;
    }

    private function absolutePath(#[SensitiveParameter] string $root, FilePath $file): string
    {
        if ($file->relative === '') {
            return $root;
        }

        return "{$root}/{$file->relative}";
    }

    /**
     * The real path, read past PHP's realpath and stat caches, so a link re-pointed while the worker runs is seen.
     */
    private function freshRealPath(#[SensitiveParameter] string $root, FilePath $file): string|null
    {
        $path = $this->absolutePath($root, $file);
        clearstatcache(true, $path);
        $real = realpath($path);

        if ($real === false) {
            return null;
        }

        return $real;
    }

    /**
     * A real path, refused when it leaves the place root or lies in a closed folder once its links are followed.
     */
    private function confined(
        FilePath $file,
        #[SensitiveParameter]
        string $root,
        #[SensitiveParameter]
        string $real,
    ): string {
        if (! $this->roots->isWithin($real, $file->place)) {
            throw LinkLeavesPlace::from($file->label());
        }

        $this->closed->assertNotClosed(FilePath::in($file->place, ltrim(substr($real, strlen($root)), '/')));

        return $real;
    }

    /**
     * Whether a path that does not resolve fails because its links lead round in a loop, rather than because a name
     * on its way is missing. The links are walked by hand, since PHP reports no reason when a path does not resolve.
     */
    private function isLinkLoop(FilePath $file, #[SensitiveParameter] string $root): bool
    {
        $names = explode('/', $file->relative);
        $current = $root;
        $links = 0;

        while ($names !== [] && $links <= self::LINK_LIMIT) {
            $name = array_shift($names);

            if ($name === '' || $name === '.') {
                continue;
            }

            $next = $name === '..' ? dirname($current) : "{$current}/{$name}";

            if (is_link($next)) {
                $links++;
                $target = (string) readlink($next);
                $names = [...explode('/', $target), ...$names];
                $current = str_starts_with($target, '/') ? '' : $current;

                continue;
            }

            if (! file_exists($next)) {
                return false;
            }

            $current = $next;
        }

        return $links > self::LINK_LIMIT;
    }

    /**
     * Why nothing is at the path: a loop of links, or the given missing failure.
     */
    private function missing(FilePath $file, FileMissing|FolderMissing $missing): LinkLoop|FileMissing|FolderMissing
    {
        if ($this->isLinkLoop($file, $this->roots->root($file->place))) {
            return LinkLoop::at($file->label());
        }

        return $missing;
    }
}
