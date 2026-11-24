<?php

declare(strict_types=1);

namespace App\Commands\ClaimAccountCheck;

use App\Contracts\Bus\CommandHandler;
use App\Models\Accounts\Account;
use App\Values\ClaimedAccountCheck;

final readonly class ClaimAccountCheckHandler implements CommandHandler
{
    public function handle(ClaimAccountCheckCommand $command): ClaimedAccountCheck|null
    {
        $account = Account::nextDueForCheck();

        if ($account === null || $account->directory === null) {
            return null;
        }

        return new ClaimedAccountCheck(
            $account->id,
            $account->account_protocol,
            $account->method,
            $account->directory,
            (int) $account->check_requested_generation,
        );
    }
}
