<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Commands\Notifications\HideUnseatedNotifications\HideUnseatedNotificationsCommand;
use App\Contracts\Bus\JournalCommands;
use App\Contracts\Events\Listener;
use App\Enums\ActorType;
use App\Enums\CommandEntry;
use App\Events\Assignments\AssignmentsChanged;
use App\Support\AssigneeIdentity;

/**
 * After a change of holders committed, hides each former holder's question receipts of inboxes it no longer sits
 * at, a batch per command until none are left. Until then the feed's own check of each item keeps the titles out.
 */
final readonly class HideReceiptsOfLostSeats implements Listener
{
    private const string TRUSTED_ENTRY = 'lost seats';

    public function __construct(private JournalCommands $journal) {}

    public function handle(AssignmentsChanged $fact): void
    {
        foreach ($this->previousHolders($fact) as $holder) {
            do {
                $hidden = $this->journal->runAsJournal(
                    CommandEntry::EngineMaintenance,
                    self::TRUSTED_ENTRY,
                    new HideUnseatedNotificationsCommand($holder->type, $holder->id),
                );
            } while ($hidden === HideUnseatedNotificationsCommand::BATCH);
        }
    }

    /**
     * The distinct actors that held a record before the change and hold it no longer.
     *
     * @return list<AssigneeIdentity>
     */
    private function previousHolders(AssignmentsChanged $fact): array
    {
        $holders = [];

        foreach ($fact->changes as $change) {
            $before = $change->before?->holder();
            $after = $change->after?->holder();

            if ($before === null || ActorType::tryFrom($before->type) === null) {
                continue;
            }

            if ($after !== null && $after->type === $before->type && $after->id === $before->id) {
                continue;
            }

            $holders["{$before->type}:{$before->id}"] = $before;
        }

        return array_values($holders);
    }
}
