<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Accounts\Enums\CommandEntry;
use App\Bus\JournalCommands;
use App\Contracts\Events\Listener;
use App\Events\Skills\SkillsChanged;
use App\Skills\Commands\RefreshSkills\RefreshSkillsCommand;

/**
 * After a stored skill changed and its transaction committed, the journal refreshes the catalogue as itself, so the
 * running sessions it applies to get a pending publication. It writes no file.
 */
final readonly class RefreshOnSkillsChanged implements Listener
{
    public function __construct(
        private JournalCommands $dispatchers,
    ) {}

    public function handle(SkillsChanged $event): void
    {
        $this->dispatchers->runAsJournal(CommandEntry::SkillRefresh, 'skill refresh', new RefreshSkillsCommand());
    }
}
