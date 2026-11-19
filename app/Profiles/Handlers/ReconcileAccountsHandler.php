<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Bus\Contracts\CommandBus;
use App\Contracts\CommandHandler;
use App\Profiles\Commands\ExpireSignInAttempt;
use App\Profiles\Commands\ReconcileAccounts;
use App\Profiles\Commands\ReleaseSignInAgain;
use App\Profiles\Models\SignInAttempt;
use Carbon\CarbonImmutable;

/**
 * Ends each overdue sign-in through the same expiry the deadline job runs, so a sweep and a late job never disagree.
 */
final readonly class ReconcileAccountsHandler implements CommandHandler
{
    private const int BATCH = 100;

    public function __construct(private CommandBus $commands) {}

    public function handle(ReconcileAccounts $command): int
    {
        $expired = 0;

        foreach (SignInAttempt::expiredLiveIds(CarbonImmutable::now(), self::BATCH) as $attemptId) {
            $expired += $this->commands->run(new ExpireSignInAttempt($attemptId)) ? 1 : 0;
        }

        foreach (SignInAttempt::waitingForUsesIds(self::BATCH) as $attemptId) {
            $this->commands->run(new ReleaseSignInAgain($attemptId));
        }

        return $expired;
    }
}
