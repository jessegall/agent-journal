<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Bus\ConsoleOwner;
use App\Bus\Contracts\CommandBus;
use App\CommandRules\Commands\SaveCommandAlias\SaveCommandAliasCommand as SaveCommandAlias;
use App\Exceptions\ConsoleOwnerMissing;
use App\Models\Projects\Project;
use Illuminate\Console\Command;

/**
 * The owner saves a command line under an alias of a project, which the classifier then reads by its name.
 */
final class SaveCommandAliasCommand extends Command
{
    protected $signature = 'processes:alias-save {name : The alias} {line : The command line it runs}'
        .' {--project= : The key of the project, the local project when none is given}'
        .' {--argument=* : The name of each positional argument the line takes}';

    protected $description = 'Save a command line under an alias of a project';

    /**
     * @throws ConsoleOwnerMissing
     */
    public function handle(ConsoleOwner $owner, CommandBus $commands): int
    {
        $project = $this->project();
        $owner->actAsOwner();

        try {
            $revision = $commands->run(new SaveCommandAlias(
                $project->id,
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

    private function project(): Project
    {
        $key = $this->option('project');

        if (! is_string($key)) {
            return Project::findLocal();
        }

        return Project::findForKey($key);
    }
}
