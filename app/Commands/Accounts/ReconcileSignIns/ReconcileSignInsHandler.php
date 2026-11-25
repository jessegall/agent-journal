<?php

declare(strict_types=1);

namespace App\Commands\Accounts\ReconcileSignIns;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandHandler;
use App\Enums\Accounts\SignInState;
use App\Models\Accounts\SignInAttempt;
use Carbon\CarbonImmutable;

/**
 * Ends each live attempt the host took but no longer runs as interrupted, in the order the attempt's own end takes
 * its locks: a new account's folder is then owed its cleanup, and an account signed in again is checked before
 * starts use it.
 */
final readonly class ReconcileSignInsHandler implements CommandHandler
{
    public function __construct(private CommandFacts $facts) {}

    public function handle(ReconcileSignInsCommand $command): int
    {
        $ended = 0;

        foreach (SignInAttempt::findLostBy($command->hostId, $command->runningAttemptIds) as $attempt) {
            $attempt->finishAt(SignInState::Interrupted, CarbonImmutable::now());
            $this->facts->runTransactionListeners();
            $ended++;
        }

        return $ended;
    }
}
