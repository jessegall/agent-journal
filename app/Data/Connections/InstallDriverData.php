<?php

declare(strict_types=1);

namespace App\Data\Connections;

use Spatie\LaravelData\Attributes\MapOutputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * One driver a connected machine's installer seals: the official install it takes from the machine's PATH, the
 * build that install must report, the arguments that make it report its build, and the name plans call it by.
 */
#[MapOutputName(SnakeCaseMapper::class)]
final class InstallDriverData extends Data
{
    /**
     * @param  list<string>  $check
     */
    public function __construct(
        public readonly string $name,
        public readonly string $executable,
        public readonly string $build,
        public readonly array $check,
        public readonly string $hostName,
    ) {}
}
