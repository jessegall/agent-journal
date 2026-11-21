<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Bus\Contracts\CommandFacts;
use App\Contracts\CommandHandler;
use App\Profiles\Commands\ReconcileSignIns;
use App\Profiles\Enums\SignInState;
use App\Profiles\Models\SignInAttempt;
use Carbon\CarbonImmutable;

/**
 * Ends each live attempt the host took but no longer runs as interrupted, in the order the attempt's own end takes
 * its locks: a new account's folder is then owed its cleanup, and an account signed in again is checked before
 * starts use it.
 */
final readonly class ReconcileSignInsHandler implements CommandHandler
{
    public function __construct(private CommandFacts $facts) {}

    public function handle(ReconcileSignIns $command): int
    {
        $ended = 0;

        foreach (SignInAttempt::lostBy($command->hostId, $command->runningAttemptIds) as $attempt) {
            $attempt->finishAt(SignInState::Interrupted, CarbonImmutable::now());
            $this->facts->applyRequired();
            $ended++;
        }

        return $ended;
    }
}
