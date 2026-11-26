<?php

declare(strict_types=1);

namespace App\Accounts\Commands\RecordThreadTokens;

use App\Accounts\UsageReadings;
use App\Accounts\UsageReportAccounts;
use App\Bus\Contracts\CommandHandler;

/**
 * Keeps a reported thread token count under the saved account of the start the host claimed, replacing an older one.
 */
final readonly class RecordThreadTokensHandler implements CommandHandler
{
    public function __construct(private UsageReportAccounts $accounts, private UsageReadings $readings) {}

    public function handle(RecordThreadTokensCommand $command): void
    {
        $account = $this->accounts->accountOf($command->start);

        $this->readings->recordTokens($account, $command->start->generation, $command->tokens);
    }
}
