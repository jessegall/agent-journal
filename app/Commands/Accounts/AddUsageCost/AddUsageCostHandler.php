<?php

declare(strict_types=1);

namespace App\Commands\Accounts\AddUsageCost;

use App\Contracts\Bus\CommandHandler;
use App\Models\Accounts\AccountUsageCost;
use App\Support\UsageReportAccounts;

/**
 * Keeps a reported result's cost once under the saved account of the start the host claimed, in the generation that
 * start ran in, even after the start stopped or the account signed in again.
 */
final readonly class AddUsageCostHandler implements CommandHandler
{
    public function __construct(private UsageReportAccounts $accounts) {}

    public function handle(AddUsageCostCommand $command): void
    {
        $account = $this->accounts->accountOf($command->start);

        AccountUsageCost::add($account, $command->start->generation, $command->cost);
    }
}
