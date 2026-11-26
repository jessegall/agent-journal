<?php

declare(strict_types=1);

namespace App\Accounts\Commands\NotifySignIn;

use App\Accounts\Enums\SignInOutcome;
use App\Accounts\Enums\SignInRefusal;
use App\Accounts\Enums\SignInStatus;
use App\Accounts\SignInChallenges;
use App\Accounts\SignInCompletion;
use App\Bus\Contracts\CommandFacts;
use App\Bus\Contracts\CommandHandler;
use App\Models\Accounts\SignInAttempt;
use Carbon\CarbonImmutable;

/**
 * Applies the runner's report to the attempt it runs: a verified sign-in goes through the completion that rechecks
 * deadline and generation, a failure ends a live attempt, an answer whose delivery broke ends it interrupted, and
 * waiting lets a result complete it later.
 */
final readonly class NotifySignInHandler implements CommandHandler
{
    public function __construct(
        private SignInCompletion $completion,
        private SignInChallenges $challenges,
        private CommandFacts $facts,
    ) {}

    public function handle(NotifySignInCommand $command): void
    {
        $attempt = SignInAttempt::findRunBy($command->hostId, $command->attemptId);

        match ($command->outcome) {
            SignInOutcome::Waiting => $attempt->waitForUser(),
            SignInOutcome::Verified => $this->completion->complete(
                $attempt->id,
                $command->generation,
                $command->identity,
            ),
            SignInOutcome::Failed => $this->end(
                $attempt,
                SignInStatus::Failed,
                SignInRefusal::fromProvider($command->refusal)->text(),
            ),
            SignInOutcome::Interrupted => $this->interrupt($attempt, $command->generation),
        };
    }

    /**
     * The host could not tell whether the driver took the user's answer: a live attempt of that generation ends
     * interrupted and its staged answer is erased, so it is never given again. The host's own words are not kept: the
     * state says what happened.
     */
    private function interrupt(SignInAttempt $attempt, int $generation): void
    {
        if ($attempt->generation !== $generation) {
            return;
        }

        $this->end($attempt, SignInStatus::Interrupted, null);
    }

    /**
     * Ends a live attempt through its one guarded step, so one past its deadline ends Expired instead, and forgets its
     * challenge and any staged answer.
     */
    private function end(SignInAttempt $attempt, SignInStatus $status, string|null $reason): void
    {
        $attempt->finishAt($status, CarbonImmutable::now(), $reason);
        $this->challenges->forget($attempt->id);
        $this->facts->runTransactionListeners();
    }
}
