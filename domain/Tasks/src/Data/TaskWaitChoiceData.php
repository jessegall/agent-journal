<?php

declare(strict_types=1);

namespace Domain\Tasks\Data;

use Domain\Tasks\Enums\TaskStatus;
use Domain\Tasks\Values\TaskCard;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A task a prerequisite search found: its number, title and state.
 */
#[TypeScript]
final class TaskWaitChoiceData extends Data
{
    public function __construct(
        public readonly string $number,
        public readonly string $title,
        public readonly TaskStatus $status,
    ) {}

    public static function ofCard(TaskCard $card): self
    {
        return new self((string) $card->number, $card->title, $card->status);
    }
}
