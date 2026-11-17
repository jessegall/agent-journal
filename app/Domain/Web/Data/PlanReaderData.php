<?php

declare(strict_types=1);

namespace App\Domain\Web\Data;

use App\Domain\Plans\Api\PlanSelection;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The selected plan in the reader: its card, the start when it is offered, and whether it is among the listed results.
 */
#[TypeScript]
final class PlanReaderData extends Data
{
    public function __construct(
        public readonly PlanCardData $card,
        public readonly bool $insideResults,
        public readonly StartPlanData|Optional $start = new Optional,
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
            'start' => StartPlanData::optionalOrMissing($card->canStart ? ['planId' => (string) $card->id] : null),
        ]);
    }
}
