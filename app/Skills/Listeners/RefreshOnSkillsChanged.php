<?php

declare(strict_types=1);

namespace App\Skills\Listeners;

use App\Bus\Enums\CommandEntry;
use App\Bus\Support\EntryDispatchers;
use App\Contracts\Listener;
use App\Skills\Commands\RefreshSkills\RefreshSkillsCommand;
use App\Skills\Events\SkillsChanged;

/**
 * After a stored skill changed and its transaction committed, the journal refreshes the catalogue as itself, so the
 * running sessions it applies to get a pending publication. It writes no file.
 */
final readonly class RefreshOnSkillsChanged implements Listener
{
    public function __construct(
        private EntryDispatchers $dispatchers,
    ) {}

    public function handle(SkillsChanged $event): void
    {
        $this->dispatchers->runAsJournal(CommandEntry::SkillPublisher, 'skill refresh', new RefreshSkillsCommand());
    }
}
