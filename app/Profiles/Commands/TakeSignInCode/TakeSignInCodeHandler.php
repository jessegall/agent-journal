<?php

declare(strict_types=1);

namespace App\Profiles\Commands\TakeSignInCode;

use App\Contracts\CommandHandler;
use App\Profiles\Models\SignInAttempt;
use App\Profiles\Support\SignInChallenges;
use App\Profiles\Values\SignInPoll;
use Carbon\CarbonImmutable;

final readonly class TakeSignInCodeHandler implements CommandHandler
{
    public function __construct(private SignInChallenges $challenges) {}

    public function handle(TakeSignInCodeCommand $command): SignInPoll
    {
        $attemptId = SignInAttempt::runBy($command->hostId, $command->attemptId)->id;
        $attempt = SignInAttempt::lockedForJournal($attemptId);

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
