<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\ReportSignIn;
use App\Profiles\Enums\SignInOutcome;
use App\Profiles\Enums\SignInState;
use App\Profiles\Events\AccountsChanged;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Support\SignInCompletion;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Applies the runner's report to the attempt it runs: a verified sign-in goes through the completion that rechecks
 * deadline and generation, a failure ends a live attempt, and waiting lets a result complete it later.
 */
final readonly class ReportSignInHandler implements CommandHandler
{
    public function __construct(private SignInCompletion $completion, private Dispatcher $events) {}

    public function handle(ReportSignIn $command): void
    {
        $attempt = SignInAttempt::runBy($command->hostId, $command->attemptId);

        match ($command->outcome) {
            SignInOutcome::Waiting => $attempt->waitForPerson(),
            SignInOutcome::Verified => $this->completion->complete(
                $attempt->id,
                $command->generation,
                $command->identity,
            ),
            SignInOutcome::Failed => $this->fail($attempt),
        };
    }

    private function fail(SignInAttempt $attempt): void
    {
        if (! $attempt->isLive()) {
            return;
        }

        $attempt->finish(SignInState::Failed);
        $this->events->dispatch(new AccountsChanged($attempt->program, $attempt->account_id ?? $attempt->id));
    }
}
