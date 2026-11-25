<?php

declare(strict_types=1);

namespace Domain\Plans\Api;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The plan a write made or changed.
 */
#[MapName(SnakeCaseMapper::class)]
final class PlanNamed extends Data
{
    public function __construct(
        public string $planId,
    ) {}
}
