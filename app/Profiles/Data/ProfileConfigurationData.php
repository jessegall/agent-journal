<?php

declare(strict_types=1);

namespace App\Profiles\Data;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The top of a proposed profile configuration as it is written: its revision, the overrides per built-in base and the
 * profiles by key, each still in its written form.
 */
#[MapName(SnakeCaseMapper::class)]
final class ProfileConfigurationData extends Data
{
    /**
     * @param  array<string, array<string, mixed>>  $baseOverrides
     * @param  array<string, array<string, mixed>>  $profiles
     */
    public function __construct(
        public readonly int $revision = 0,
        public readonly array $baseOverrides = [],
        public readonly array $profiles = [],
    ) {}
}
