<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\SubmitSignInCode;
use App\Profiles\Exceptions\SignInAnswerRefused;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Support\SignInChallenges;
use App\Profiles\Support\SignInProtocols;
use App\Profiles\Values\SignInCode;
use App\Profiles\Values\SignInSecret;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Config\Repository;

final readonly class SubmitSignInCodeHandler implements CommandHandler
{
    public function __construct(
        private SignInChallenges $challenges,
        private SignInProtocols $protocols,
        private Repository $config,
    ) {}

    public function handle(SubmitSignInCode $command): void
    {
        $attempt = SignInAttempt::lockedForOwner($command->attemptId);

        if ($attempt->tookAnswer($command->submissionKey)) {
            return;
        }

        $attempt->assertWaitsForAnswer(CarbonImmutable::now());

        if (! $this->protocols->for($attempt->driver, $attempt->method)->canTakeAnswer()) {
            throw SignInAnswerRefused::asksForNone($attempt->id);
        }

        $text = $attempt->method->isSecret()
            ? $this->secretOf($attempt, $command->code)
            : SignInCode::from($command->code)->code;

        $this->challenges->typeCode($attempt->id, $command->submissionKey, $text, $attempt->expires_at);
        $attempt->acceptAnswer($command->submissionKey);
    }

    /**
     * The key or token the owner gave, with its fingerprint kept on the attempt.
     */
    private function secretOf(SignInAttempt $attempt, string $text): string
    {
        $secret = SignInSecret::from($text);
        $key = $this->config->string('app.key');
        $attempt->keepFingerprint($secret->fingerprintFor($attempt->driver, $attempt->method, $key));

        return $secret->secret;
    }
}
