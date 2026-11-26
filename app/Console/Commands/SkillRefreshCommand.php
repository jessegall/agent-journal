<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Accounts\Enums\CommandEntry;
use App\Bus\JournalCommands;
use App\Skills\Commands\RefreshSkills\RefreshSkillsCommand;
use App\Skills\SkillTables;
use Illuminate\Console\Command;

/**
 * The host's start-up and update step, as the journal itself: checks and renders the catalogue as one generation.
 */
final class SkillRefreshCommand extends Command
{
    protected $signature = 'skill:refresh';

    protected $description = 'Check and render every skill as one generation';

    public function handle(SkillTables $tables, JournalCommands $dispatchers): int
    {
        if (! $tables->exist()) {
            $this->error('The skills tables do not exist yet: run php artisan migrate first. Nothing was changed.');

            return self::FAILURE;
        }

        $refresh = $dispatchers->runAsJournal(CommandEntry::SkillRefresh, 'skill refresh', new RefreshSkillsCommand());

        if ($refresh->hasFailed) {
            $this->error("The skills could not be generated, the previous generation stays in use: {$refresh->reason}");

            return self::FAILURE;
        }

        $this->line($refresh->isReused
            ? "Generation {$refresh->generationId} is unchanged."
            : "Generation {$refresh->generationId} is ready.");

        return self::SUCCESS;
    }
}
