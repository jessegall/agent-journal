<?php

declare(strict_types=1);

namespace App\Profiles\Listeners;

use App\Agents\Events\DriverFailed;
use App\Bus\Contracts\JournalCommands;
use App\Bus\Enums\CommandEntry;
use App\Contracts\Listener;
use App\Profiles\Commands\RecordAccountFailure\RecordAccountFailureCommand;
use App\Profiles\Models\Account;

/**
 * A rejected sign-in on a saved account asks the host to check that account in the generation the failure was seen
 * in; one failure alone never signs the account out, and other failures ask nothing.
 */
final readonly class CheckFailedAccount implements Listener
{
    public function __construct(private JournalCommands $journal) {}

    public function handle(DriverFailed $failed): void
    {
        $account = $failed->account;

        if (! $failed->failure->isAccountCheckNeeded() || $account === null || $failed->accountGeneration === null) {
            return;
        }

        if ($account->type !== Account::LINK_TYPE) {
            return;
        }

        $this->journal->runAsJournal(
            CommandEntry::AccountMaintenance,
            'failed account check',
            new RecordAccountFailureCommand($account->id, $failed->accountGeneration),
        );
    }
}
