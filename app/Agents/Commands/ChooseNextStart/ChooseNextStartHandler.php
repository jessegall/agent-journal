<?php

declare(strict_types=1);

namespace App\Agents\Commands\ChooseNextStart;

use App\Bus\Contracts\CommandHandler;
use App\Models\Agents\AgentStartChoice;

/**
 * Keeps the choice for the agent's next start, in place of the one it kept before.
 */
final readonly class ChooseNextStartHandler implements CommandHandler
{
    public function handle(ChooseNextStartCommand $command): void
    {
        $choice = AgentStartChoice::findFor($command->agentId);

        if ($choice === null) {
            AgentStartChoice::create($command->agentId, $command->driver, $command->model, $command->account);

            return;
        }

        $choice->choose($command->driver, $command->model, $command->account);
    }
}
