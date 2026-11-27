<?php

declare(strict_types=1);

namespace Domain\Plans\Api;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The phase a write made.
 */
#[MapName(SnakeCaseMapper::class)]
final class PhaseNamed extends Data
{
    public function __construct(
        public readonly string $phaseId,
    ) {}
}
