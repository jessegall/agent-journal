<?php

declare(strict_types=1);

namespace Domain\Tasks\Data;

use Spatie\LaravelData\Data;

/**
 * A task's long texts, which a read gives only when it asks for them: its brief, result note and reasons.
 */
final class TaskText extends Data
{
    public function __construct(
        public readonly string $brief,
        public readonly string|null $resultNote,
        public readonly string|null $blockReason,
        public readonly string|null $cancelReason,
    ) {}
}
