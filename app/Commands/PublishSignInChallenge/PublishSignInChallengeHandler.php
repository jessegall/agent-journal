<?php

declare(strict_types=1);

namespace App\Commands\PublishSignInChallenge;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandHandler;
use App\Events\AccountsChanged;
use App\Exceptions\SignInChallengeRefused;
use App\Models\Accounts\SignInAttempt;
use App\Support\SignInChallenges;
use App\Support\SignInProtocols;
use App\Values\SignInChallenge;

/**
 * Keeps the challenge for the user until the attempt's deadline, and tells the page a challenge waits, without it.
 */
final readonly class PublishSignInChallengeHandler implements CommandHandler
{
    public function __construct(
        private SignInChallenges $challenges,
        private CommandFacts $facts,
        private SignInProtocols $protocols,
    ) {}

    public function handle(PublishSignInChallengeCommand $command): void
    {
        $attempt = SignInAttempt::runBy($command->hostId, $command->attemptId);

        if (! $attempt->isLive()) {
            return;
        }

        $hosts = $this->protocols->for($attempt->account_protocol, $attempt->method)->signInHosts();

        if (! $hosts->admits($command->address)) {
            throw SignInChallengeRefused::untrustedAddress($attempt->id);
        }

        $challenge = new SignInChallenge($command->address, $command->code);
        $this->challenges->publish($attempt->id, $challenge, $attempt->expires_at);

        $this->facts->publishAfterCommit(
            new AccountsChanged($attempt->account_protocol, $attempt->account_id ?? $attempt->id),
        );
    }
}
