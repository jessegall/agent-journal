<?php

declare(strict_types=1);

namespace Domain\Tasks\Data;

use Domain\Tasks\Enums\TaskState;
use Domain\Tasks\Enums\TaskWaitTargetType;
use Domain\Tasks\Values\TaskWaitLink;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The other task of one wait as the task reader lists it: a task with its number, title and state; a removed task,
 * kept unresolved; or a task the caller may not see, named only as a prerequisite they cannot see. Whether the wait is
 * met, and who waived it, when and why when it was waived.
 */
#[TypeScript]
final class TaskWaitItemData extends Data
{
    public function __construct(
        public readonly TaskWaitTargetType $type,
        public readonly bool $isSatisfied,
        public readonly string|Optional $number = new Optional(),
        public readonly string|Optional $title = new Optional(),
        public readonly TaskState|Optional $state = new Optional(),
        public readonly string|Optional $waivedAt = new Optional(),
        public readonly string|Optional $waivedByType = new Optional(),
        public readonly string|Optional $waivedById = new Optional(),
        public readonly string|Optional $waiveReason = new Optional(),
    ) {}

    public static function ofLink(TaskWaitLink $link): self
    {
        return self::from(array_filter([
            'type' => $link->number === null ? TaskWaitTargetType::Removed : TaskWaitTargetType::Task,
            'isSatisfied' => $link->isSatisfied,
            'number' => $link->number === null ? null : (string) $link->number,
            'title' => $link->title,
            'state' => $link->state,
            'waivedAt' => $link->waivedAt?->toIso8601String(),
            'waivedByType' => $link->waivedBy?->type,
            'waivedById' => $link->waivedBy?->id,
            'waiveReason' => $link->waiveReason,
        ], fn (mixed $itemValue) => $itemValue !== null));
    }
}
