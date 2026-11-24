<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\SaveCommandAlias;

use App\Contracts\Bus\CommandHandler;
use App\Models\CommandRules\CommandAlias;

final readonly class SaveCommandAliasHandler implements CommandHandler
{
    public function handle(SaveCommandAliasCommand $command): int
    {
        $alias = CommandAlias::forName($command->projectKey, $command->name);
        $alias->recordLine($command->line, $command->arguments);

        return $alias->revision;
    }
}
