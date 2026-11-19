<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use Domain\Plans\Api\PlanSelection;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The selected plan in the resolver: its card, the start when it is offered, and whether it is among the listed results.
 */
#[TypeScript]
final class PlanReaderData extends Data
{
    public function __construct(
        public readonly PlanCardData $card,
        public readonly bool $insideResults,
        public readonly StartPlanData|Optional $start = new Optional(),
    ) {}

    /**
     * The reader of a selection, or nothing when no plan was selected or the selection cannot be read.
     */
    public static function ofSelection(PlanSelection $selection): self|Optional
    {
        $card = $selection->card;

        if ($card === null) {
            return Optional::create();
        }

        return self::from([
            'card' => PlanCardData::fromPlanCard($card),
            'insideResults' => $selection->isInsideFilter,
            'start' => $card->canStart ? StartPlanData::from(['planId' => (string) $card->id, 'planNumber' => (string) $card->number]) : Optional::create(),
        ]);
    }
}
