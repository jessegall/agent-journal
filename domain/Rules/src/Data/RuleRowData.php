<?php

declare(strict_types=1);

namespace Domain\Rules\Data;

use Domain\Rules\Api\RuleView;
use Domain\Rules\Enums\RuleState;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One rule in the list: its number, its text and where it stands.
 *
 * @method static static from(RuleView $rule)
 */
#[TypeScript]
final class RuleRowData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $number,
        public readonly string $text,
        public readonly RuleState $state,
    ) {}

    public static function fromRuleView(RuleView $rule): self
    {
        return new self(id: (string) $rule->id, number: (string) $rule->number, text: $rule->text, state: $rule->state);
    }
}
