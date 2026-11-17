<?php

declare(strict_types=1);

namespace App\Domain\Web\Data;

use App\Domain\Rules\Models\Rule;
use App\Domain\Rules\RuleState;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One rule in the list: its number, its text and where it stands.
 *
 * @method static static from(Rule $rule)
 */
#[TypeScript]
final class RuleRowData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $text,
        public readonly RuleState $state,
    ) {}

    public static function fromRule(Rule $rule): self
    {
        return new self(id: (string) $rule->id, text: $rule->text, state: $rule->state);
    }
}
