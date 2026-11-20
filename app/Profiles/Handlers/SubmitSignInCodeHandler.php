<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\SubmitSignInCode;
use App\Profiles\Exceptions\SignInAttemptStale;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Support\SignInChallenges;
use App\Profiles\Values\SignInCode;
use App\Profiles\Values\SignInSecret;
use Carbon\CarbonImmutable;
use Illuminate\Contracts\Config\Repository;

final readonly class SubmitSignInCodeHandler implements CommandHandler
{
    public function __construct(private SignInChallenges $challenges, private Repository $config) {}

    public function handle(SubmitSignInCode $command): void
    {
        $attempt = SignInAttempt::lockedForOwner($command->attemptId);

        if (! $attempt->isLive() || $attempt->isExpiredAt(CarbonImmutable::now())) {
            throw SignInAttemptStale::for($attempt->id);
        }

        $text = $attempt->method->isSecret()
            ? $this->secretOf($attempt, $command->code)
            : SignInCode::from($command->code)->code;
        $this->challenges->typeCode($attempt->id, $text, $attempt->expires_at);
    }

    /**
     * The key or token the owner gave, with its fingerprint kept on the attempt.
     */
    private function secretOf(SignInAttempt $attempt, string $text): string
    {
        $secret = SignInSecret::from($text);
        $key = $this->config->string('app.key');
        $attempt->keepFingerprint($secret->fingerprintFor($attempt->program, $attempt->method, $key));

        return $secret->secret;
    }
}
