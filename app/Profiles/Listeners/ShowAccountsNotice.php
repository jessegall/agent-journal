<?php

declare(strict_types=1);

namespace App\Profiles\Listeners;

use App\Agents\Events\DriverFailed;
use App\Agents\Events\StartUnavailable;
use App\Bus\Contracts\JournalCommands;
use App\Bus\Enums\CommandEntry;
use App\Contracts\Listener;
use App\Profiles\Commands\RecordAccountNotice\RecordAccountNoticeCommand;
use App\Profiles\Enums\AccountNoticeReason;

/**
 * Turns a refused start or a failure the owner can act on into a notice on the driver's accounts, from the safe
 * driver and reason alone, through its own command after the fact committed.
 */
final readonly class ShowAccountsNotice implements Listener
{
    public function __construct(private JournalCommands $journal) {}

    public function handle(StartUnavailable|DriverFailed $fact): void
    {
        $reason = $fact instanceof StartUnavailable
            ? AccountNoticeReason::forStart($fact->reason)
            : AccountNoticeReason::forFailure($fact->failure);

        if ($reason === null) {
            return;
        }

        $this->journal->runAsJournal(
            CommandEntry::AccountMaintenance,
            'accounts notice',
            new RecordAccountNoticeCommand($fact->driver, $reason),
        );
    }
}
