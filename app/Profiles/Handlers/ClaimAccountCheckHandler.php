<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\ClaimAccountCheck;
use App\Profiles\Models\Account;
use App\Profiles\Values\ClaimedAccountCheck;

final readonly class ClaimAccountCheckHandler implements CommandHandler
{
    public function handle(ClaimAccountCheck $command): ClaimedAccountCheck|null
    {
        $account = Account::nextToCheck();

        if ($account === null || $account->directory === null) {
            return null;
        }

        return new ClaimedAccountCheck(
            $account->id,
            $account->program,
            $account->method,
            $account->directory,
            (int) $account->check_requested_generation,
        );
    }
}
