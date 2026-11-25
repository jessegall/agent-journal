<?php

declare(strict_types=1);

namespace Domain\Plans\Api;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The phase tasks were added to and how many.
 */
#[MapName(SnakeCaseMapper::class)]
final class PhaseTasksAdded extends Data
{
    public function __construct(
        public string $phaseId,
        public int $added,
    ) {}
}
