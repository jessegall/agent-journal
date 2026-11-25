<?php

declare(strict_types=1);

namespace Domain\Rules\Resolvers;

use App\Contracts\Actors\CurrentActor;
use Domain\Rules\Contracts\RuleDetailsResolver;
use Domain\Rules\Exceptions\RuleMissing;
use Domain\Rules\Models\Rule;
use Domain\Rules\Values\RuleDetails;
use Illuminate\Container\Attributes\Scoped;

/**
 * Reads one rule with its proposal, and counts the rules that hold.
 */
#[Scoped]
final readonly class RuleDetailRecords implements RuleDetailsResolver
{
    public function __construct(private CurrentActor $actors) {}

    public function rule(string $ruleId): RuleDetails
    {
        $this->actors->actor();
        $rule = Rule::query()->findOr($ruleId, RuleMissing::throwing()->withId($ruleId));
        $replaced = $rule->replaces_rule_id === null ? null : Rule::query()->find($rule->replaces_rule_id);

        return $rule->details($replaced?->number);
    }

    public function activeCount(): int
    {
        $this->actors->actor();

        return Rule::query()->active()->count();
    }
}
