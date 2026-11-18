<?php

declare(strict_types=1);

namespace Domain\Tasks\Http\Data;

use App\Assignments\Support\AssignmentData;
use Domain\Tasks\Api\TaskCard;
use Domain\Tasks\Enums\TaskState;
use Spatie\LaravelData\Data;

/**
 * One task the calling agent holds, as the agent's list gives it: its id, title, state and the holder with the
 * reference a deliberate change must name.
 *
 * @method static static from(TaskCard|array<string, mixed> $payload)
 * @method static array<int, static> collect(list<TaskCard> $cards)
 */
final class AssignedTaskCardData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $title,
        public readonly TaskState $state,
        public readonly AssignmentData $holder,
    ) {}

    public static function fromCard(TaskCard $card): self
    {
        return self::from([
            'id' => $card->id,
            'title' => $card->title,
            'state' => $card->state,
            'holder' => AssignmentData::ofHolder($card->holder),
        ]);
    }
}
