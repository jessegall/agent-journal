<?php

declare(strict_types=1);

namespace Domain\Tasks\Calls;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The task a write made.
 */
#[MapName(SnakeCaseMapper::class)]
final class TaskNamed extends Data
{
    public function __construct(
        public string $taskId,
    ) {}
}
