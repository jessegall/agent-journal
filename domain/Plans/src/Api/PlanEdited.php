<?php

declare(strict_types=1);

namespace Domain\Plans\Api;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The plan an edit changed and its revision now.
 */
#[MapName(SnakeCaseMapper::class)]
final class PlanEdited extends Data
{
    public function __construct(
        public readonly string $planId,
        public readonly int $revision,
    ) {}
}
