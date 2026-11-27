<?php

declare(strict_types=1);

namespace Domain\Tasks\Api;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The task an edit changed and its revision now.
 */
#[MapName(SnakeCaseMapper::class)]
final class TaskEdited extends Data
{
    public function __construct(
        public readonly string $taskId,
        public readonly int $revision,
    ) {}
}
