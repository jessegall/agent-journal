<?php

declare(strict_types=1);

namespace Tests\Support\Processes;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The shell corpus manifest: its schema version, the hash of each fixture file, and how many cases and inputs the
 * corpus holds.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class ShellCorpusManifest extends Data
{
    /**
     * @param  array<string, string>  $fixtures  the sha256 hash of each fixture file, by its name
     */
    public function __construct(
        public readonly int $schemaVersion,
        public readonly array $fixtures,
        public readonly ShellCorpusCounts $counts,
    ) {}
}
