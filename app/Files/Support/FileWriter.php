<?php

declare(strict_types=1);

namespace App\Files\Support;

use App\Files\Exceptions\FileExists;
use App\Files\Exceptions\FileUnwritable;

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
