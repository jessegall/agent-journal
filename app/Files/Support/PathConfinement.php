<?php

declare(strict_types=1);

namespace App\Files\Support;

use App\Files\Exceptions\FileMissing;
use App\Files\Exceptions\FileUnreadable;
use App\Files\Exceptions\FolderMissing;
use App\Files\Exceptions\LinkLeavesPlace;
use App\Files\Exceptions\LinkLoop;
use App\Files\Values\FilePath;

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
        $this->closed->assertNotClosed($file);
        $root = $this->roots->root($file->place);
        $real = $this->freshRealPath($root, $file);

        if ($real === false) {
            throw $this->loopOf($file, $root) ?? FileMissing::at($file);
        }

        return $this->confined($file, $root, $real);
    }

    /**
     * The real path of what is at a path, or false when nothing is; a link out of the place is still refused.
     */
    public function existingRealPath(FilePath $file): string|false
    {
        $this->closed->assertNotClosed($file);
        $root = $this->roots->root($file->place);
        $real = $this->freshRealPath($root, $file);

        return $real === false ? false : $this->confined($file, $root, $real);
    }

    /**
     * The real path of an existing folder; FolderMissing when nothing, or a file, is there.
     */
    public function resolvedFolder(FilePath $folder): string
    {
        $this->closed->assertNotClosed($folder);
        $root = $this->roots->root($folder->place);
        $real = $this->freshRealPath($root, $folder);

        if ($real === false) {
            throw $this->loopOf($folder, $root) ?? FolderMissing::at($folder);
        }

        if (! is_dir($real)) {
            throw FolderMissing::at($folder);
        }

        return $this->confined($folder, $root, $real);
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
            throw LinkLeavesPlace::from($file);
        }

        $confined = $this->confined($file, $root, $real);

        return $missing === [] ? $confined : $this->confined($file, $root, $confined.'/'.implode('/', $missing));
    }

    /**
     * The opened file at a resolved real path, refused when the file was swapped for a link or another file after
     * it was checked.
     *
     * @return resource
     */
    public function opened(FilePath $file, string $real, string $mode)
    {
        clearstatcache(true, $real);
        $checked = @lstat($real);

        if ($checked === false) {
            throw FileMissing::at($file);
        }

        if (is_link($real)) {
            throw LinkLeavesPlace::from($file);
        }

        if (! is_file($real)) {
            throw FileUnreadable::at($file);
        }

        $handle = @fopen($real, $mode);

        if ($handle === false) {
            throw FileUnreadable::at($file);
        }

        $opened = fstat($handle);

        if ($opened === false || $opened['ino'] !== $checked['ino'] || $opened['dev'] !== $checked['dev']) {
            fclose($handle);

            throw LinkLeavesPlace::from($file);
        }

        return $handle;
    }

    private function absolutePath(string $root, FilePath $file): string
    {
        return $file->relative === '' ? $root : "{$root}/{$file->relative}";
    }

    /**
     * The real path, read past PHP's realpath and stat caches, so a link re-pointed while the worker runs is seen.
     */
    private function freshRealPath(string $root, FilePath $file): string|false
    {
        $path = $this->absolutePath($root, $file);
        clearstatcache(true, $path);

        return realpath($path);
    }

    /**
     * A real path, refused when it leaves the place root or lies in a closed folder once its links are followed.
     */
    private function confined(FilePath $file, string $root, string $real): string
    {
        if (! $this->roots->isWithin($real, $file->place)) {
            throw LinkLeavesPlace::from($file);
        }

        $this->closed->assertNotClosed(FilePath::in($file->place, ltrim(substr($real, strlen($root)), '/')));

        return $real;
    }

    /**
     * The loop a path that does not resolve runs into, if its links lead round in one; none when a name on its way is
     * missing. The links are walked by hand, since PHP reports no reason when a path does not resolve.
     */
    private function loopOf(FilePath $file, string $root): LinkLoop|null
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
                return null;
            }

            $current = $next;
        }

        return $links > self::LINK_LIMIT ? LinkLoop::at($file) : null;
    }
}
