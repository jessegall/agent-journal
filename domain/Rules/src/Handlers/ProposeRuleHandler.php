<?php

declare(strict_types=1);

namespace Domain\Rules\Handlers;

use App\Contracts\CommandHandler;
use Domain\Rules\Commands\ProposeRule;
use Domain\Rules\Models\Rule;

/**
 * Saves the proposed rule and answers its id.
 */
final readonly class ProposeRuleHandler implements CommandHandler
{
    public function handle(ProposeRule $command): string
    {
        return Rule::proposed($command->text)->id;
    }
}
