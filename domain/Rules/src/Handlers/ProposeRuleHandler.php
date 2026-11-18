<?php

declare(strict_types=1);

namespace Domain\Rules\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Enums\ActorType;
use App\Agents\Contracts\CurrentSession;
use App\Contracts\CommandHandler;
use Domain\Rules\Commands\ProposeRule;
use Domain\Rules\Exceptions\RuleMissing;
use Domain\Rules\Models\Rule;

final readonly class ProposeRuleHandler implements CommandHandler
{
    public function __construct(private CurrentActor $actors, private CurrentSession $session) {}

    /**
     * @throws RuleMissing when the rule it would replace does not exist
     */
    public function handle(ProposeRule $command): string
    {
        if ($command->replacesRuleId !== null) {
            Rule::query()->find($command->replacesRuleId) ?? throw RuleMissing::withId($command->replacesRuleId);
        }

        $proposer = $this->actors->actor();
        $session = $proposer->type === ActorType::Agent ? $this->session->sessionId() : null;

        return Rule::proposed($command->text, $command->reason, $command->replacesRuleId, $proposer, $session)->id;
    }
}
