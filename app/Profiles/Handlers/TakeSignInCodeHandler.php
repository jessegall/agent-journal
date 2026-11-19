<?php

declare(strict_types=1);

namespace App\Profiles\Handlers;

use App\Contracts\CommandHandler;
use App\Profiles\Commands\TakeSignInCode;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Support\SignInChallenges;

final readonly class TakeSignInCodeHandler implements CommandHandler
{
    public function __construct(private SignInChallenges $challenges) {}

    public function handle(TakeSignInCode $command): string|null
    {
        $attempt = SignInAttempt::runBy($command->hostId, $command->attemptId);

        return $this->challenges->takeCode($attempt->id);
    }
}
