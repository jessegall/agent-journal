<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\SwitchAccount;
use App\Profiles\Models\Account;
use App\Profiles\Models\ActiveAccount;
use App\Profiles\Support\AccountNotices;
use Carbon\CarbonImmutable;

/**
 * Chooses the account under the driver's selection lock and then the account's, the order every start takes, and
 * tells the owner's pages once that has committed. Choosing the chosen account again changes nothing.
 */
final readonly class SwitchAccountHandler implements CommandHandler
{
    public function __construct(private AccountNotices $notices) {}

    public function handle(SwitchAccount $command): void
    {
        $driver = Account::driverOf($command->accountId);
        $selection = ActiveAccount::lockedFor($driver);

        if ($command->expectedChangeNumber !== null) {
            $selection->assertAtChange($command->expectedChangeNumber);
        }

        $account = Account::lockedForChange($command->accountId);

        $this->notices->resolveOpen($driver->value, CarbonImmutable::now());

        $selection->switchTo($account);
    }
}
