<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use App\Support\AssignmentData;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Values\PlanCard;
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
        public readonly string $id,
        public readonly string $title,
        public readonly PlanType $type,
        public readonly PlanState $state,
        public readonly AssignmentData $holder,
    ) {}

    public static function fromCard(PlanCard $card): self
    {
        return self::from([
            'id' => $card->id,
            'title' => $card->title,
            'type' => $card->type,
            'state' => $card->state,
            'holder' => AssignmentData::ofHolder($card->holder->get()),
        ]);
    }
}
