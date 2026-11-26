<?php

declare(strict_types=1);

namespace App\Accounts\Commands\ReconcileAccounts;

use App\Accounts\Commands\ExpireSignInAttempt\ExpireSignInAttemptCommand;
use App\Accounts\Commands\ReleaseAccountRemoval\ReleaseAccountRemovalCommand;
use App\Accounts\Commands\ReleaseSignInAgain\ReleaseSignInAgainCommand;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\CommandHandler;
use App\Models\Accounts\Account;
use App\Models\Accounts\SignInAttempt;
use Carbon\CarbonImmutable;

/**
 * Ends each overdue sign-in through the same expiry the deadline job runs, so a sweep and a late job never disagree.
 */
final readonly class ReconcileAccountsHandler implements CommandHandler
{
    private const int BATCH = 100;

    public function __construct(private CommandBus $commands) {}

    public function handle(ReconcileAccountsCommand $command): int
    {
        $expired = 0;

        foreach (SignInAttempt::resolveExpiredLiveIds(CarbonImmutable::now(), self::BATCH) as $attemptId) {
            $expired += $this->commands->run(new ExpireSignInAttemptCommand($attemptId)) ? 1 : 0;
        }

        foreach (SignInAttempt::resolveWaitingForUsesIds(self::BATCH) as $attemptId) {
            $this->commands->run(new ReleaseSignInAgainCommand($attemptId));
        }

        foreach (Account::resolveWaitingForCleanupIds(self::BATCH) as $accountId) {
            $this->commands->run(new ReleaseAccountRemovalCommand($accountId));
        }

        return $expired;
    }
}
