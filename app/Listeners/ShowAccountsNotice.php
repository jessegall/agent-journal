<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Commands\RecordAccountNotice\RecordAccountNoticeCommand;
use App\Contracts\JournalCommands;
use App\Contracts\Listener;
use App\Enums\AccountNoticeReason;
use App\Enums\CommandEntry;
use App\Events\DriverFailed;
use App\Events\StartUnavailable;

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
