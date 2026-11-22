<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Commands\RefreshSkills\RefreshSkillsCommand;
use App\Contracts\Listener;
use App\Enums\CommandEntry;
use App\Events\SkillsChanged;
use App\Support\EntryDispatchers;

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
