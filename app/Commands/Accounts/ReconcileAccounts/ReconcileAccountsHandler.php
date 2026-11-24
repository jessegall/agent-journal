<?php

declare(strict_types=1);

namespace App\Commands\Accounts\ReconcileAccounts;

use App\Commands\Accounts\ExpireSignInAttempt\ExpireSignInAttemptCommand;
use App\Commands\Accounts\ReleaseAccountRemoval\ReleaseAccountRemovalCommand;
use App\Commands\Accounts\ReleaseSignInAgain\ReleaseSignInAgainCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Bus\CommandHandler;
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

        foreach (SignInAttempt::expiredLiveIds(CarbonImmutable::now(), self::BATCH) as $attemptId) {
            $expired += $this->commands->run(new ExpireSignInAttemptCommand($attemptId)) ? 1 : 0;
        }

        foreach (SignInAttempt::waitingForUsesIds(self::BATCH) as $attemptId) {
            $this->commands->run(new ReleaseSignInAgainCommand($attemptId));
        }

        foreach (Account::waitingForCleanupIds(self::BATCH) as $accountId) {
            $this->commands->run(new ReleaseAccountRemovalCommand($accountId));
        }

        return $expired;
    }
}
