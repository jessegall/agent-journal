<?php

declare(strict_types=1);

namespace App\Domain\Plans\Http\Data;

use App\Core\Assignments\Support\AssignmentData;
use App\Domain\Plans\Api\PlanCard;
use App\Domain\Plans\Enums\PlanKind;
use App\Domain\Plans\Enums\PlanState;
use Spatie\LaravelData\Data;

/**
 * One plan the calling agent holds, as the agent's list gives it: its id, title, state and the holder with the
 * reference a deliberate change must name.
 *
 * @method static static from(PlanCard|array<string, mixed> $payload)
 * @method static array<int, static> collect(list<PlanCard> $cards)
 */
final class AssignedPlanCardData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $title,
        public readonly PlanKind $kind,
        public readonly PlanState $state,
        public readonly AssignmentData $holder,
    ) {}

    public static function fromCard(PlanCard $card): self
    {
        return self::from([
            'id' => $card->id,
            'title' => $card->title,
            'kind' => $card->kind,
            'state' => $card->state,
            'holder' => AssignmentData::ofHolder($card->holder->get()),
        ]);
    }
}
