<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\SubmitSignInCode;
use App\Profiles\Exceptions\SignInAttemptStale;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Support\SignInChallenges;
use App\Profiles\Values\SignInCode;
use Carbon\CarbonImmutable;

final readonly class SubmitSignInCodeHandler implements CommandHandler
{
    public function __construct(private SignInChallenges $challenges) {}

    public function handle(SubmitSignInCode $command): void
    {
        $code = SignInCode::from($command->code);
        $attempt = SignInAttempt::lockedForOwner($command->attemptId);

        if (! $attempt->isLive() || $attempt->isExpiredAt(CarbonImmutable::now())) {
            throw SignInAttemptStale::for($attempt->id);
        }

        $this->challenges->typeCode($attempt->id, $code->code, $attempt->expires_at);
    }
}
