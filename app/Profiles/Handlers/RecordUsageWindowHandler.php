<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\RecordUsageWindow;
use App\Profiles\Models\AccountUsageWindow;
use App\Profiles\Support\UsageReportAccounts;

/**
 * Keeps a reported limit window under the saved account of the start the host claimed; a window of an earlier
 * sign-in generation than the account's is acknowledged and ignored.
 */
final readonly class RecordUsageWindowHandler implements CommandHandler
{
    public function __construct(private UsageReportAccounts $accounts) {}

    public function handle(RecordUsageWindow $command): void
    {
        $account = $this->accounts->accountOf($command->start);

        AccountUsageWindow::record($account, $command->start->generation, $command->reading);
    }
}
