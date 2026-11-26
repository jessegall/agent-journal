<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Accounts\Commands\RecordAccountNotice\RecordAccountNoticeCommand;
use App\Accounts\Contracts\AccountNoticeCause;
use App\Accounts\Enums\CommandEntry;
use App\Bus\Contracts\JournalCommands;
use App\Contracts\Events\Listener;

/**
 * Turns a refused start or a failure the owner can act on into a notice on the driver's accounts, from the safe
 * driver and reason alone, through its own command after the fact committed.
 */
final readonly class ShowAccountsNotice implements Listener
{
    public function __construct(private JournalCommands $journal) {}

    public function handle(AccountNoticeCause $fact): void
    {
        $reason = $fact->noticeReason();

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
