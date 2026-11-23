<?php

declare(strict_types=1);

namespace Domain\Plans\Data;

use Domain\Plans\Values\PlanCard;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The selected plan in the resolver: its card, which carries the start when it is offered, its whole brief, whether it
 * is among the listed results, the page of its outline the reader asked for, and its review.
 */
#[TypeScript]
final class PlanReaderData extends Data
{
    public function __construct(
        public readonly PlanCardData $card,
        public readonly bool $insideResults,
        public readonly string $brief,
        public readonly PlanOutlineData $outline,
        public readonly PlanReviewData|Optional $review = new Optional(),
    ) {}

    /**
     * The reader of one plan opened by its number: its card, brief, the page of its outline asked for and its review.
     */
    public static function forPlan(
        PlanCard $card,
        string $brief,
        PlanOutlineData $outline,
        PlanReviewData $review,
    ): self {
        return self::from([
            'card' => PlanCardData::fromPlanCard($card),
            'insideResults' => true,
            'brief' => $brief,
            'outline' => $outline,
            'review' => $review,
        ]);
    }
}
