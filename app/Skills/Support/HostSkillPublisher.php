<?php

declare(strict_types=1);

namespace App\Skills\Support;

use App\Skills\Contracts\SkillPublisher;
use App\Skills\Exceptions\SkillPublicationFailed;
use FilesystemIterator;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use SplFileInfo;

/**
 * Writes skills on the host, and only inside the journal's protected skills root: staged folders under generations,
 * and per target a symlink the journal created, switched to a complete staged folder by an atomic rename under a
 * short flock. A target that is anything else is someone's own files and is never touched.
 */
final readonly class HostSkillPublisher implements SkillPublisher
{
    public function __construct(
        private SkillTargets $targets,
    ) {}

    public function stage(string $stagingFolder, array $files): void
    {
        $folder = $this->insideRoot($stagingFolder);

        foreach ($files as $relative => $bytes) {
            if ($relative === '' || str_starts_with($relative, '/') || in_array('..', explode('/', $relative), true)) {
                throw SkillPublicationFailed::escape($relative);
            }

            $path = "{$folder}/{$relative}";

            if (is_file($path) && hash_file('sha256', $path) === hash('sha256', $bytes)) {
                continue;
            }

            $this->write($path, $bytes);
        }
    }

    public function activate(string $target, string $stagingFolder): void
    {
        $activePath = $this->insideRoot($target);
        $folder = $this->insideRoot($stagingFolder);
        $this->makeFolder(dirname($activePath));
        $lock = fopen("{$activePath}.lock", 'c');

        if ($lock === false) {
            throw SkillPublicationFailed::write("the lock beside {$activePath} cannot be opened");
        }

        try {
            flock($lock, LOCK_EX);
            $this->checkOwned($activePath);
            $pointer = "{$activePath}.next-".bin2hex(random_bytes(6));

            if (! @symlink($folder, $pointer) || ! @rename($pointer, $activePath)) {
                @unlink($pointer);

                throw SkillPublicationFailed::write("the pointer at {$activePath} cannot be switched");
            }
        } finally {
            flock($lock, LOCK_UN);
            fclose($lock);
        }
    }

    public function clear(string $stagingFolder, array $files): void
    {
        $folder = $this->insideRoot($stagingFolder);

        if (! is_dir($folder) || is_link($folder)) {
            return;
        }

        $skillFiles = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($folder, FilesystemIterator::SKIP_DOTS),
            RecursiveIteratorIterator::CHILD_FIRST,
        );
        $paths = iterator_to_array($skillFiles, false);

        foreach ($paths as $entry) {
            $this->checkStaged($folder, $entry, $files);
        }

        foreach ($paths as $entry) {
            $this->remove($entry);
        }

        rmdir($folder);
        $generation = dirname($folder);

        if (dirname($generation) === $this->targets->generationsFolder() && $this->isEmptyFolder($generation)) {
            rmdir($generation);
        }
    }

    public function activeFolder(string $target): string|null
    {
        $activePath = $this->insideRoot($target);

        return is_link($activePath) ? (string) readlink($activePath) : null;
    }

    /**
     * Refuses a target that exists and is not a symlink into the protected root, which only the journal makes.
     */
    private function checkOwned(string $target): void
    {
        if (! file_exists($target) && ! is_link($target)) {
            return;
        }

        if (! is_link($target)) {
            throw SkillPublicationFailed::collision($target);
        }

        $points = (string) readlink($target);

        if (! str_starts_with($points, $this->targets->generationsFolder().'/')) {
            throw SkillPublicationFailed::collision($target);
        }
    }

    /**
     * Refuses an entry of a staged folder that the journal did not write there with these bytes: an unknown file, a
     * changed one, or a link.
     *
     * @param  array<string, string>  $files
     */
    private function checkStaged(string $folder, SplFileInfo $entry, array $files): void
    {
        $relative = substr($entry->getPathname(), strlen($folder) + 1);

        if ($entry->isLink()) {
            throw SkillPublicationFailed::changedFile($entry->getPathname());
        }

        if ($entry->isDir()) {
            return;
        }

        $staged = array_key_exists($relative, $files)
            && hash_file('sha256', $entry->getPathname()) === hash('sha256', $files[$relative]);

        if (! $staged) {
            throw SkillPublicationFailed::changedFile($entry->getPathname());
        }
    }

    private function remove(SplFileInfo $entry): void
    {
        if ($entry->isDir()) {
            rmdir($entry->getPathname());

            return;
        }

        unlink($entry->getPathname());
    }

    private function isEmptyFolder(string $folder): bool
    {
        return is_dir($folder) && ! is_link($folder) && new FilesystemIterator($folder)->valid() === false;
    }

    /**
     * The path, checked to lie inside the protected root, never through a parent step.
     */
    private function insideRoot(string $path): string
    {
        $root = rtrim($this->targets->root(), '/');

        if (! str_starts_with($path, $root.'/') || in_array('..', explode('/', $path), true)) {
            throw SkillPublicationFailed::escape($path);
        }

        $existing = $path;

        while (! file_exists($existing) && $existing !== $root && $existing !== '/') {
            $existing = dirname($existing);
        }

        $real = realpath($existing);
        $realRoot = realpath($root);

        $leavesRoot = $real !== false
            && $realRoot !== false
            && $real !== $realRoot
            && ! str_starts_with($real, $realRoot.'/');

        if ($leavesRoot && ! is_link($path)) {
            throw SkillPublicationFailed::escape($path);
        }

        return $path;
    }

    private function write(string $path, string $bytes): void
    {
        $this->makeFolder(dirname($path));
        $temporary = "{$path}.part-".bin2hex(random_bytes(6));

        if (@file_put_contents($temporary, $bytes) !== strlen($bytes) || ! @rename($temporary, $path)) {
            @unlink($temporary);

            throw SkillPublicationFailed::write("{$path} cannot be written");
        }
    }

    private function makeFolder(string $folder): void
    {
        if (! is_dir($folder) && ! @mkdir($folder, 0o755, true) && ! is_dir($folder)) {
            throw SkillPublicationFailed::write("the folder {$folder} cannot be made");
        }
    }
}
