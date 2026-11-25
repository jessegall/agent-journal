<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\SaveCommandAlias;

use App\Contracts\Bus\CommandHandler;
use App\Models\CommandRules\CommandAlias;
use App\Models\Projects\Project;

final readonly class SaveCommandAliasHandler implements CommandHandler
{
    public function handle(SaveCommandAliasCommand $command): int
    {
        $alias = CommandAlias::create(Project::findForId($command->projectId), $command->name);
        $alias->recordLine($command->line, $command->arguments);

        return $alias->revision;
    }
}
