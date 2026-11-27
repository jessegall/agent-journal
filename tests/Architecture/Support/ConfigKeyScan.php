<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use Tests\Support\ScanCache\FileScan;

/**
 * The configuration keys a file names in a #[Config('...')] attribute or a config('...') read, each once.
 *
 * @implements FileScan<string>
 */
final readonly class ConfigKeyScan implements FileScan
{
    private const string NAMED_KEY = '/(?:#\[Config\(|\bconfig\()\s*\'([a-z_][a-z0-9_\-]*(?:\.[a-z0-9_\-]+)*)\'/';

    public function key(): string
    {
        return 'config-keys-1';
    }

    public function findingsIn(ParsedFile $file): array
    {
        preg_match_all(self::NAMED_KEY, $file->code, $found);

        return array_values(array_unique($found[1]));
    }
}
