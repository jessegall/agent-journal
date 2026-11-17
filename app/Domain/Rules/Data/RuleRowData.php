<?php

declare(strict_types=1);

namespace App\Domain\Rules\Data;

use App\Domain\Rules\Api\RuleView;
use App\Domain\Rules\Enums\RuleState;
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
        public readonly string $text,
        public readonly RuleState $state,
    ) {}

    public static function fromRuleView(RuleView $rule): self
    {
        return new self(id: (string) $rule->id, text: $rule->text, state: $rule->state);
    }
}
