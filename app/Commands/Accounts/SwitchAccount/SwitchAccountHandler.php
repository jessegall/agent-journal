<?php

declare(strict_types=1);

namespace App\Commands\Accounts\SwitchAccount;

use App\Contracts\Bus\CommandHandler;
use App\Models\Accounts\Account;
use App\Models\Accounts\ActiveAccount;
use App\Support\AccountNotices;
use Carbon\CarbonImmutable;

/**
 * Chooses the account under the driver's selection lock and then the account's, the order every start takes, and
 * tells the owner's pages once that has committed. Choosing the chosen account again changes nothing.
 */
final readonly class SwitchAccountHandler implements CommandHandler
{
    public function __construct(private AccountNotices $notices) {}

    public function handle(SwitchAccountCommand $command): void
    {
        $driver = Account::resolveDriverOf($command->accountId);
        $selection = ActiveAccount::findLockedFor($driver);

        if ($command->expectedChangeNumber !== null) {
            $selection->assertAtChange($command->expectedChangeNumber);
        }

        $account = Account::findLockedForChange($command->accountId);

        $this->notices->resolveOpen($driver, CarbonImmutable::now());

        $selection->switchTo($account);
    }
}
