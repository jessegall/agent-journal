<?php

declare(strict_types=1);

namespace Domain\Rules\Support;

use App\Sessions\Contracts\ProfileRules;
use App\Sessions\Values\ProfileRule;
use App\Sessions\Values\ProfileRuleGroup;
use App\Sessions\Values\ProfileRuleGroups;
use App\Values\ProfileKey;
use Domain\Rules\Models\Rule;

/**
 * The rules a profile works under: every rule that holds applies to every agent, so each profile has the one group of
 * them, empty while no rule holds.
 */
final readonly class ProfileRuleRecords implements ProfileRules
{
    public const string GROUP_LABEL = 'Rules every agent works under';

    public function __construct(private ActiveRules $rules) {}

    public function of(ProfileKey $profile): ProfileRuleGroups
    {
        $rules = array_map(fn (Rule $rule) => new ProfileRule($rule->number, $rule->text), $this->rules->all());

        return ProfileRuleGroups::read([new ProfileRuleGroup(self::GROUP_LABEL, $rules)]);
    }
}
