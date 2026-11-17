<?php

declare(strict_types=1);

namespace App\Domain\Web\Data;

use App\Domain\Rules\Models\Rule;
use App\Domain\Rules\RuleState;
use App\Domain\Web\Data\Concerns\OptionalOrMissing;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The selected rule as the reader shows it. Its text never changes after it is proposed, so the text the user reads
 * is the text an approval approves; canReview says whether it still waits for approval.
 *
 * @method static static from(Rule $rule)
 */
#[TypeScript]
final class RuleReaderData extends Data
{
    use OptionalOrMissing;

    public function __construct(
        public readonly string $id,
        public readonly string $text,
        public readonly RuleState $state,
        public readonly bool $canReview,
    ) {}

    public static function fromRule(Rule $rule): self
    {
        return new self(
            id: (string) $rule->id,
            text: $rule->text,
            state: $rule->state,
            canReview: $rule->canBeReviewed(),
        );
    }
}
