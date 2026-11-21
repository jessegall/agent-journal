<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\RecordThreadTokens;
use App\Profiles\Support\UsageReadings;
use App\Profiles\Support\UsageReportAccounts;

/**
 * Keeps a reported thread token count under the saved account of the start the host claimed, replacing an older one.
 */
final readonly class RecordThreadTokensHandler implements CommandHandler
{
    public function __construct(private UsageReportAccounts $accounts, private UsageReadings $readings) {}

    public function handle(RecordThreadTokens $command): void
    {
        $account = $this->accounts->accountOf($command->start);

        $this->readings->recordTokens($account, $command->start->generation, $command->tokens);
    }
}
