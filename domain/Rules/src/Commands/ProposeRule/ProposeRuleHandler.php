<?php

declare(strict_types=1);

namespace Domain\Rules\Commands\ProposeRule;

use Domain\Rules\Commands\Support\RuleCommandHandler;
use Domain\Rules\Exceptions\RuleMissing;
use Domain\Rules\Models\Rule;

final readonly class ProposeRuleHandler extends RuleCommandHandler
{
    /**
     * @throws RuleMissing when the rule it would replace does not exist
     */
    public function handle(ProposeRuleCommand $command): string
    {
        if ($command->replacesRuleId !== null) {
            Rule::query()->findOr(
                $command->replacesRuleId,
                RuleMissing::throwing()->withId($command->replacesRuleId),
            );
        }

        return Rule::create($command->text, $command->reason, $command->replacesRuleId, $command->dispatchedBy())->id;
    }
}
