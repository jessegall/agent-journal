<?php

declare(strict_types=1);

namespace Domain\Rules\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Contracts\CommandHandler;
use Domain\Rules\Commands\ProposeRule;
use Domain\Rules\Exceptions\RuleMissing;
use Domain\Rules\Models\Rule;

final readonly class ProposeRuleHandler implements CommandHandler
{
    public function __construct(private CurrentActor $actors) {}

    /**
     * @throws RuleMissing when the rule it would replace does not exist
     */
    public function handle(ProposeRule $command): string
    {
        if ($command->replacesRuleId !== null) {
            Rule::query()->find($command->replacesRuleId) ?? throw RuleMissing::withId($command->replacesRuleId);
        }

        return Rule::proposed($command->text, $command->reason, $command->replacesRuleId, $this->actors->actor())->id;
    }
}
