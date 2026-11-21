<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\CheckAccount;
use App\Profiles\Enums\AccountNoticeReason;
use App\Profiles\Models\Account;
use App\Profiles\Models\ActiveAccount;
use App\Profiles\Support\AccountNotices;
use Carbon\CarbonImmutable;

/**
 * Applies a host's account check under the program's selection lock and then the account's, only in the generation
 * it was made in: a definite sign-out makes the account need a new sign-in, takes it off as the program's choice so
 * no new start uses it, and tells the owner. Starts already running keep running until they end on their own.
 */
final readonly class CheckAccountHandler implements CommandHandler
{
    public function __construct(private AccountNotices $notices) {}

    public function handle(CheckAccount $command): void
    {
        $driver = Account::driverForJournal($command->accountId);
        $selection = ActiveAccount::lockedForJournal($driver);
        $account = Account::lockedForJournal($command->accountId);

        if (! $account->applyCheck($command->generation, $command->accountCheck, CarbonImmutable::now())) {
            return;
        }

        $selection->clearIfChosen($account);
        $this->notices->record($account->driver, AccountNoticeReason::NeedsSignIn);
    }
}
