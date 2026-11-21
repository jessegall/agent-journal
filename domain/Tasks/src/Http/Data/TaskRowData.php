<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Data;

use App\Assignments\Support\AssignmentData;
use Domain\Tasks\Api\TaskCard;
use Domain\Tasks\Enums\TaskState;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One row of the tasks window: the task's id, its display number as a decimal string, its title and state, and its
 * holder when anyone holds it. Long texts stay in the task's reader.
 *
 * @method static static from(TaskCard|array<string, mixed> $payload)
 * @method static array<int, static> collect(list<TaskCard> $cards)
 */
#[TypeScript]
final class TaskRowData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $number,
        public readonly string $title,
        public readonly TaskState $state,
        public readonly AssignmentData|Optional $holder = new Optional(),
    ) {}

    public static function fromCard(TaskCard $card): self
    {
        return self::from(array_filter([
            'id' => $card->id,
            'number' => (string) $card->number,
            'title' => $card->title,
            'state' => $card->state,
            'holder' => $card->holder->map(AssignmentData::ofHolder(...))->getOrElse(null),
        ], fn (mixed $rowValue) => $rowValue !== null));
    }
}
