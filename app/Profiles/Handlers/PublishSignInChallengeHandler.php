<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Bus\Contracts\CommandFacts;
use App\Contracts\CommandHandler;
use App\Profiles\Commands\PublishSignInChallenge;
use App\Profiles\Events\AccountsChanged;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Support\SignInChallenges;
use App\Profiles\Values\SignInChallenge;

/**
 * Keeps the challenge for the user until the attempt's deadline, and tells the page a challenge waits, without it.
 */
final readonly class PublishSignInChallengeHandler implements CommandHandler
{
    public function __construct(private SignInChallenges $challenges, private CommandFacts $facts) {}

    public function handle(PublishSignInChallenge $command): void
    {
        $attempt = SignInAttempt::runBy($command->hostId, $command->attemptId);

        if (! $attempt->isLive()) {
            return;
        }

        $challenge = new SignInChallenge($command->address, $command->code);
        $this->challenges->publish($attempt->id, $challenge, $attempt->expires_at);
        $this->facts->publishAfterCommit(new AccountsChanged($attempt->driver, $attempt->account_id ?? $attempt->id));
    }
}
