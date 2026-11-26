<?php

declare(strict_types=1);

namespace App\Accounts\Commands\TakeSignInCode;

use App\Accounts\SignInChallenges;
use App\Accounts\Values\SignInPoll;
use App\Bus\Contracts\CommandHandler;
use App\Models\Accounts\SignInAttempt;
use Carbon\CarbonImmutable;

final readonly class TakeSignInCodeHandler implements CommandHandler
{
    public function __construct(private SignInChallenges $challenges) {}

    public function handle(TakeSignInCodeCommand $command): SignInPoll
    {
        $attemptId = SignInAttempt::findRunBy($command->hostId, $command->attemptId)->id;
        $attempt = SignInAttempt::findLockedForJournal($attemptId);

        $isLive = $attempt->isLive()
            && ! $attempt->isExpiredAt(CarbonImmutable::now())
            && $attempt->generation === $command->generation;

        if (! $isLive) {
            $this->challenges->forget($attempt->id);

            return SignInPoll::ended();
        }

        return new SignInPoll(true, $this->challenges->takeCode($attempt));
    }
}
