<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Commands\CommandRules\SaveCommandAlias\SaveCommandAliasCommand as SaveCommandAlias;
use App\Contracts\Bus\CommandBus;
use App\Exceptions\ConsoleOwnerMissing;
use App\Support\ConsoleOwner;
use App\Values\ExecutionContext;
use Illuminate\Console\Command;

/**
 * The owner saves a command line under an alias of a project, which the classifier then reads by its name.
 */
final class SaveCommandAliasCommand extends Command
{
    protected $signature = 'processes:alias-save {project : The root folder of the project} {name : The alias}'
        .' {line : The command line it runs} {--argument=* : The name of each positional argument the line takes}';

    protected $description = 'Save a command line under an alias of a project';

    /**
     * @throws ConsoleOwnerMissing
     */
    public function handle(ConsoleOwner $owner, CommandBus $commands): int
    {
        $owner->actAsOwner();

        try {
            $revision = $commands->run(new SaveCommandAlias(
                ExecutionContext::inFolder((string) $this->argument('project'))->projectKey(),
                (string) $this->argument('name'),
                (string) $this->argument('line'),
                array_values(array_map('strval', (array) $this->option('argument'))),
            ));
        } finally {
            $owner->finish();
        }

        $this->line("Saved. The alias is at revision {$revision}.");

        return self::SUCCESS;
    }
}
