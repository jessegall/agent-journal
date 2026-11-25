<?php

declare(strict_types=1);

namespace App\Commands\Accounts\SubmitSignInCode;

use App\Contracts\Bus\CommandHandler;
use App\Exceptions\SignInAnswerRefused;
use App\Models\Accounts\SignInAttempt;
use App\Support\SignInChallenges;
use App\Support\SignInProtocols;
use App\Values\SignInCode;
use App\Values\SignInSecret;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Config\Repository;

final readonly class SubmitSignInCodeHandler implements CommandHandler
{
    public function __construct(
        private SignInChallenges $challenges,
        private SignInProtocols $protocols,
        private Repository $config,
    ) {}

    public function handle(SubmitSignInCodeCommand $command): void
    {
        $attempt = SignInAttempt::findLockedForOwner($command->attemptId);

        if ($attempt->hasTakenAnswer($command->submissionKey)) {
            return;
        }

        $attempt->assertWaitsForAnswer(CarbonImmutable::now());

        if (! $this->protocols->for($attempt->account_protocol, $attempt->method)->canTakeAnswer()) {
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
        $attempt->keepFingerprint($secret->fingerprintFor($attempt->account_protocol, $attempt->method, $key));

        return $secret->secret;
    }
}
