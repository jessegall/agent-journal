<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Bus\Contracts\CommandFacts;
use App\Contracts\CommandHandler;
use App\Profiles\Commands\ReportSignIn;
use App\Profiles\Enums\SignInOutcome;
use App\Profiles\Exceptions\SignInAnswerUndelivered;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Support\SignInChallenges;
use App\Profiles\Support\SignInCompletion;

/**
 * Applies the runner's report to the attempt it runs: a verified sign-in goes through the completion that rechecks
 * deadline and generation, a failure ends a live attempt, an answer whose delivery broke ends it interrupted, and
 * waiting lets a result complete it later.
 */
final readonly class ReportSignInHandler implements CommandHandler
{
    public function __construct(
        private SignInCompletion $completion,
        private SignInChallenges $challenges,
        private CommandFacts $facts,
    ) {}

    public function handle(ReportSignIn $command): void
    {
        $attempt = SignInAttempt::runBy($command->hostId, $command->attemptId);

        match ($command->outcome) {
            SignInOutcome::Waiting => $attempt->waitForUser(),
            SignInOutcome::Verified => $this->completion->complete(
                $attempt->id,
                $command->generation,
                $command->identity,
            ),
            SignInOutcome::Failed => $this->fail($attempt, $command->refusal),
            SignInOutcome::Interrupted => $this->interrupt($attempt, $command->generation, $command->refusal),
        };
    }

    /**
     * The host could not tell whether the program took the user's answer: a live attempt of that generation ends
     * interrupted and its staged answer is erased, so it is never given again.
     */
    private function interrupt(SignInAttempt $attempt, int $generation, string|null $reason): void
    {
        if (! $attempt->isLive() || $attempt->generation !== $generation) {
            return;
        }

        $attempt->interrupt($reason ?? SignInAnswerUndelivered::toProgram()->getMessage());
        $this->challenges->forget($attempt->id);
        $this->facts->applyRequired();
    }

    private function fail(SignInAttempt $attempt, string|null $refusal): void
    {
        if (! $attempt->isLive()) {
            return;
        }

        $attempt->fail($refusal);
        $this->facts->applyRequired();
    }
}
