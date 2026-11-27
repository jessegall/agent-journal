<?php

declare(strict_types=1);

namespace Domain\Tasks\Data;

use Spatie\LaravelData\Attributes\MapInputName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * A task's long texts, which a read gives only when it asks for them: its brief, result note and reasons.
 */
#[MapInputName(SnakeCaseMapper::class)]
final class TaskText extends Data
{
    public function __construct(
        public readonly string $brief,
        public readonly string|null $resultNote,
        public readonly string|null $blockReason,
        public readonly string|null $cancelReason,
    ) {}
}
