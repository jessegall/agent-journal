<?php

declare(strict_types=1);

namespace App\Files\Support;

use App\Files\Exceptions\FileExists;
use App\Files\Exceptions\FileUnwritable;
use App\Files\Exceptions\FolderTooDeep;
use FilesystemIterator;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;

/**
 * Writes at a real path already confined to its place: a whole file replaced atomically, a file created only when
 * none is there, a line appended under a lock. A new file has its mode from the moment it appears.
 */
final readonly class FileWriter
{
    /**
     * Replaces the whole file: the bytes go to a temporary file beside it, which is then renamed over it, so a reader
     * sees the old file or the new, never half of one. A failure leaves the old file and no temporary file.
     */
    public function replace(string $real, string $bytes, int $mode, string $label): void
    {
        $temporary = dirname($real).'/.'.basename($real).'.'.bin2hex(random_bytes(6)).'.tmp';

        try {
            $this->writeNew($temporary, $bytes, $mode, $label);

            if (! @rename($temporary, $real)) {
                throw FileUnwritable::at($label);
            }
        } finally {
            if (file_exists($temporary)) {
                @unlink($temporary);
            }
        }
    }

    /**
     * Creates the file with the bytes; an existing file is refused and left untouched.
     */
    public function create(string $real, string $bytes, int $mode, string $label): void
    {
        if (file_exists($real) || is_link($real)) {
            throw FileExists::at($label);
        }

        $this->writeNew($real, $bytes, $mode, $label);
    }

    /**
     * Adds a line at the end of the file under an exclusive lock, so two writers' lines never interleave; a missing
     * file is made with the mode.
     */
    public function append(string $real, string $line, int $mode, string $label): void
    {
        $handle = $this->opened($real, 'ab', $mode, $label);

        try {
            if (! flock($handle, LOCK_EX) || fwrite($handle, $line) !== strlen($line) || ! fflush($handle)) {
                throw FileUnwritable::at($label);
            }
        } finally {
            flock($handle, LOCK_UN);
            fclose($handle);
        }
    }

    /**
     * The lock file opened and locked exclusively, made with the mode when it is missing.
     *
     * @return resource
     */
    public function lockOpened(string $real, int $mode, string $label)
    {
        $handle = $this->opened($real, 'cb', $mode, $label);

        if (! flock($handle, LOCK_EX)) {
            fclose($handle);

            throw FileUnwritable::at($label);
        }

        return $handle;
    }

    /**
     * Makes a folder and every missing folder above it with the mode.
     */
    public function makeFolder(string $real, int $mode, string $label): void
    {
        if (is_dir($real)) {
            return;
        }

        if (! @mkdir($real, $mode, true) && ! is_dir($real)) {
            throw FileUnwritable::at($label);
        }
    }

    /**
     * Removes a file or a link, never following the link; nothing at the path is no failure.
     */
    public function remove(string $path, string $label): void
    {
        if (! is_file($path) && ! is_link($path)) {
            return;
        }

        if (! @unlink($path)) {
            throw FileUnwritable::at($label);
        }
    }

    /**
     * Removes a folder and everything in it, children first; a tree deeper than the levels is refused before anything
     * is removed, and links inside are removed as links, never followed. A missing folder is no failure.
     */
    public function removeFolder(string $path, int $levels, string $label): void
    {
        if (! is_dir($path) || is_link($path)) {
            return;
        }

        $entries = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS),
            RecursiveIteratorIterator::CHILD_FIRST,
        );
        $found = [];

        foreach ($entries as $entry) {
            if ($entries->getDepth() + 1 > $levels) {
                throw FolderTooDeep::at($label, $levels);
            }

            $found[] = $entry;
        }

        foreach ($found as $entry) {
            $isRemoved = $entry->isDir() && ! $entry->isLink()
                ? @rmdir($entry->getPathname())
                : @unlink($entry->getPathname());

            if (! $isRemoved) {
                throw FileUnwritable::at($label);
            }
        }

        if (! @rmdir($path)) {
            throw FileUnwritable::at($label);
        }
    }

    /**
     * Makes a link at the path to the real target.
     */
    public function link(string $path, string $target, string $label): void
    {
        if (! @symlink($target, $path)) {
            throw FileUnwritable::at($label);
        }
    }

    /**
     * Renames an entry, replacing what is at the new path in one step, as an atomic swap of a link needs.
     */
    public function move(string $from, string $to, string $label): void
    {
        if (! @rename($from, $to)) {
            throw FileUnwritable::at($label);
        }
    }

    /**
     * Writes the bytes to a file that must not exist yet, with its mode set before the first byte.
     */
    private function writeNew(string $real, string $bytes, int $mode, string $label): void
    {
        $handle = $this->opened($real, 'xb', $mode, $label);

        try {
            if (fwrite($handle, $bytes) !== strlen($bytes) || ! fflush($handle)) {
                throw FileUnwritable::at($label);
            }
        } finally {
            fclose($handle);
        }
    }

    /**
     * Opens the file under a umask that lets no more than the mode through, so a file it creates appears with that
     * mode, then sets the mode exactly.
     *
     * @return resource
     */
    private function opened(string $real, string $openMode, int $mode, string $label)
    {
        $isNew = ! file_exists($real);
        $previous = umask(0o777 & ~$mode);

        try {
            $handle = @fopen($real, $openMode);
        } finally {
            umask($previous);
        }

        if ($handle === false) {
            throw $openMode === 'xb' && file_exists($real) ? FileExists::at($label) : FileUnwritable::at($label);
        }

        if ($isNew) {
            chmod($real, $mode);
        }

        return $handle;
    }
}
