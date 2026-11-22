<?php

declare(strict_types=1);

namespace App\Profiles\Commands\ReconcileAccounts;

use App\Bus\Contracts\CommandBus;
use App\Contracts\CommandHandler;
use App\Profiles\Commands\ExpireSignInAttempt\ExpireSignInAttemptCommand;
use App\Profiles\Commands\ReleaseAccountRemoval\ReleaseAccountRemovalCommand;
use App\Profiles\Commands\ReleaseSignInAgain\ReleaseSignInAgainCommand;
use App\Profiles\Models\Account;
use App\Profiles\Models\SignInAttempt;
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
