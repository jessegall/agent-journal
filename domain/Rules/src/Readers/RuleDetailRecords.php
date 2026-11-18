<?php

declare(strict_types=1);

namespace Domain\Rules\Readers;

use App\Actors\Contracts\CurrentActor;
use Domain\Rules\Api\RuleDetails;
use Domain\Rules\Contracts\RuleDetailsReader;
use Domain\Rules\Exceptions\RuleMissing;
use Domain\Rules\Models\Rule;
use Illuminate\Container\Attributes\Scoped;

/**
 * Reads one rule with its proposal, and counts the rules that hold.
 */
#[Scoped]
final readonly class RuleDetailRecords implements RuleDetailsReader
{
    public function __construct(private CurrentActor $actors) {}

    public function rule(string $ruleId): RuleDetails
    {
        $this->actors->actor();
        $rule = Rule::query()->find($ruleId) ?? throw RuleMissing::withId($ruleId);
        $replaced = $rule->replaces_rule_id === null ? null : Rule::query()->find($rule->replaces_rule_id);

        return new RuleDetails($rule->id, $rule->number, $rule->text, $rule->state, $rule->reason, $rule->proposer_type, $rule->proposer_id, $replaced?->number);
    }

    public function activeCount(): int
    {
        $this->actors->actor();

        return Rule::query()->active()->count();
    }
}
