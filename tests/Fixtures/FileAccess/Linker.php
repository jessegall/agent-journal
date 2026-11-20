<?php

declare(strict_types=1);

namespace Tests\Fixtures\FileAccess;

/**
 * A class whose methods share the names of file functions without touching the disk.
 */
final class Linker
{
    public function unlink(): void {}

    public function rename(string $label): string
    {
        return $label;
    }

    public static function file(): string
    {
        return 'a record';
    }
}
