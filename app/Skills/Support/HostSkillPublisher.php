<?php

declare(strict_types=1);

namespace App\Skills\Support;

use App\Skills\Contracts\SkillPublisher;
use App\Skills\Exceptions\SkillPublicationFailed;

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
        $target = $this->insideRoot($target);
        $folder = $this->insideRoot($stagingFolder);
        $this->makeFolder(dirname($target));
        $lock = fopen("{$target}.lock", 'c');

        if ($lock === false) {
            throw SkillPublicationFailed::write("the lock beside {$target} cannot be opened");
        }

        try {
            flock($lock, LOCK_EX);
            $this->checkOwned($target);
            $pointer = "{$target}.next-".bin2hex(random_bytes(6));

            if (! @symlink($folder, $pointer) || ! @rename($pointer, $target)) {
                @unlink($pointer);

                throw SkillPublicationFailed::write("the pointer at {$target} cannot be switched");
            }
        } finally {
            flock($lock, LOCK_UN);
            fclose($lock);
        }
    }

    public function activeFolder(string $target): string|null
    {
        $target = $this->insideRoot($target);

        return is_link($target) ? (string) readlink($target) : null;
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

        if ($real !== false && $realRoot !== false && $real !== $realRoot && ! str_starts_with($real, $realRoot.'/') && ! is_link($path)) {
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
