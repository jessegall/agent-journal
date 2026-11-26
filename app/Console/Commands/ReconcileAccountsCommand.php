<?php

declare(strict_types=1);

namespace App\Console\Commands;

use App\Accounts\Commands\ReconcileAccounts\ReconcileAccountsCommand as ReconcileAccounts;
use App\Accounts\Enums\CommandEntry;
use App\Bus\JournalCommands;
use Illuminate\Console\Command;

/**
 * Ends the sign-ins left past their deadline; the scheduler runs it every minute.
 */
final class ReconcileAccountsCommand extends Command
{
    protected $signature = 'accounts:reconcile';

    protected $description = 'End the sign-ins past their deadline';

    public function handle(JournalCommands $dispatchers): int
    {
        $expired = $dispatchers->runAsJournal(
            CommandEntry::AccountMaintenance,
            'account reconciliation',
            new ReconcileAccounts(),
        );

        $this->info("Ended {$expired} sign-ins past their deadline.");

        return self::SUCCESS;
    }
}
