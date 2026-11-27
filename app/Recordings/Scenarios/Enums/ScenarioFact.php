<?php

declare(strict_types=1);

namespace App\Recordings\Scenarios\Enums;

use App\Agents\Drivers\Enums\DriverOperation;
use App\Models\Accounts\SignInAttempt;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\DriverTurn;
use App\Models\Hosts\HostInstruction;
use App\Models\Projects\Host;
use App\Models\Sessions\SessionRequest;
use App\Recordings\Scenarios\Exceptions\ScenarioInvalid;
use App\Recordings\Scenarios\ScenarioRun;

/**
 * What a scenario's wait-for step waits until the journal holds.
 */
enum ScenarioFact: string
{
    case Answering = 'answering';
    case TurnEnded = 'turn-ended';
    case Interrupted = 'interrupted';
    case Stopped = 'stopped';
    case StartRefused = 'start-refused';
    case ChallengeShown = 'challenge-shown';
    case SignedIn = 'signed-in';
    case Installed = 'installed';
    case InstructionsAnswered = 'instructions-answered';

    /**
     * Whether the journal holds the fact now for the run: of its last agent's session, its start, its sign-in or its
     * installer. Only a yes or no now; the player waits.
     *
     * @throws ScenarioInvalid
     */
    public function isReached(ScenarioRun $run): bool
    {
        return match ($this) {
            // The session answered its first wake, as the page shows it: a terminal start proves no conversation id.
            self::Answering => DriverRequest::hasAppliedOf(
                (string) $run->lastAgent()->current_session_id,
                DriverOperation::Wake,
            ),
            self::StartRefused => SessionRequest::findUnderRequest($run->startRequest())?->isRefused() === true,
            self::TurnEnded => DriverTurn::hasLastEndedOf((string) $run->lastAgent()->current_session_id),
            self::Interrupted => DriverRequest::hasAppliedOf(
                (string) $run->lastAgent()->current_session_id,
                DriverOperation::Interrupt,
            ),
            self::Stopped => AgentSession::query()->find($run->lastAgent()->current_session_id)?->hasEnded() !== false,
            self::ChallengeShown => SignInAttempt::query()->find($run->signInAttempt())?->isWaiting() === true,
            self::SignedIn => SignInAttempt::query()->find($run->signInAttempt())?->isComplete() === true,
            self::Installed => $run->installerExit() === 0 && Host::query()->exists(),
            self::InstructionsAnswered => HostInstruction::areAllAnsweredSince($run->startedAt),
        };
    }
}
