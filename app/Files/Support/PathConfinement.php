<?php

declare(strict_types=1);

namespace App\Files\Support;

use App\Files\Exceptions\FileMissing;
use App\Files\Exceptions\FileUnreadable;
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
        $path = $this->absolutePath($root, $file);
        clearstatcache(true, $path);
        $real = realpath($path);

        if ($real === false) {
            throw $this->unresolved($file, $root);
        }

        return $this->confined($file, $root, $real);
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
     * Why a path does not resolve: its links lead round in a loop, or a name on its way is missing. The links are
     * walked by hand, since PHP reports no reason when a path does not resolve.
     */
    private function unresolved(FilePath $file, string $root): LinkLoop|FileMissing
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
                return FileMissing::at($file);
            }

            $current = $next;
        }

        return $links > self::LINK_LIMIT ? LinkLoop::at($file) : FileMissing::at($file);
    }
}
