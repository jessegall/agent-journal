<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use Domain\Plans\Api\PlanSelection;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The selected plan in the resolver: its card, which carries the start when it is offered, its whole brief, whether it
 * is among the listed results, and the page of its outline the reader asked for.
 */
#[TypeScript]
final class PlanReaderData extends Data
{
    public function __construct(
        public readonly PlanCardData $card,
        public readonly bool $insideResults,
        public readonly string $brief,
        public readonly PlanOutlineData $outline,
    ) {}

    /**
     * The reader of a selection, or nothing when no plan was selected or the selection cannot be read.
     */
    public static function ofSelection(PlanSelection $selection, PlanOutlineData|Optional $outline): self|Optional
    {
        $card = $selection->card;

        if ($card === null || $outline instanceof Optional) {
            return Optional::create();
        }

        return self::from([
            'card' => PlanCardData::fromPlanCard($card),
            'insideResults' => $selection->isInsideFilter,
            'brief' => $selection->brief,
            'outline' => $outline,
        ]);
    }
}
