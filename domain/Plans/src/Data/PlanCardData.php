<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use App\Support\AssignmentData;
use Domain\Plans\Enums\PlanState;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Values\PlanCard;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One plan card, with its task counts, whether a started plan has no unfinished task left (Ready to
 * finish; FinishPlan decides when asked), and the start when the server offers it. The id travels as a decimal string so a
 * bigint keeps its precision.
 *
 * @method static static from(PlanCard|array<string, mixed> $payload)
 * @method static array<int, static> collect(list<PlanCard> $cards)
 */
#[TypeScript]
final class PlanCardData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $number,
        public readonly string $title,
        public readonly PlanType $type,
        public readonly PlanState $state,
        public readonly bool $isFocused,
        public readonly int $finishedTasks,
        public readonly int $cancelledTasks,
        public readonly int $totalTasks,
        public readonly bool $isReadyToFinish,
        public readonly string|Optional $phase = new Optional(),
        public readonly AssignmentData|Optional $holder = new Optional(),
        public readonly StartPlanData|Optional $start = new Optional(),
    ) {}

    /**
     * The card as the browser gets it; a plan without phases has no phase key, a plan nobody holds no holder key and
     * a plan that may not start now no start key.
     */
    public static function fromPlanCard(PlanCard $card): self
    {
        return self::from(array_filter([
            'id' => (string) $card->id,
            'number' => (string) $card->number,
            'title' => $card->title,
            'type' => $card->type,
            'state' => $card->state,
            'isFocused' => $card->isFocused,
            'finishedTasks' => $card->progress->finished,
            'cancelledTasks' => $card->progress->cancelled,
            'totalTasks' => $card->progress->total,
            'isReadyToFinish' => $card->state === PlanState::Started && $card->progress->unfinished() === 0,
            'phase' => $card->currentPhase === null ? null : (string) $card->currentPhase,
            'holder' => $card->holder->map(AssignmentData::ofHolder(...))->getOrElse(null),
            'start' => $card->canStart
                ? StartPlanData::from(['planId' => (string) $card->id, 'planNumber' => (string) $card->number])
                : null,
        ], fn (mixed $fieldValue) => $fieldValue !== null));
    }
}
