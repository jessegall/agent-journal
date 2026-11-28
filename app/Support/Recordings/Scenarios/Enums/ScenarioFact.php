<?php

declare(strict_types=1);

namespace App\Support\Recordings\Scenarios\Enums;

use App\Agents\Drivers\Enums\DriverOperation;
use App\Models\Accounts\SignInAttempt;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverRequest;
use App\Models\Hosts\HostInstruction;
use App\Models\Projects\Host;
use App\Models\Sessions\SessionProcess;
use App\Models\Sessions\SessionRequest;
use App\Support\Recordings\Scenarios\Exceptions\ScenarioInvalid;
use App\Support\Recordings\Scenarios\ScenarioRun;

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
    case SignInFailed = 'sign-in-failed';
    case Installed = 'installed';
    case Connected = 'connected';
    case RelayHeartbeat = 'relay-heartbeat';
    case InstructionsAnswered = 'instructions-answered';

    public function isAboutSession(): bool
    {
        return match ($this) {
            self::Answering, self::TurnEnded, self::Interrupted, self::Stopped, self::StartRefused => true,
            default => false,
        };
    }

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
            self::StartRefused => $this->isStartRefused($run),
            // A turn ends when its wake or message is applied: the driver reports it so once the turn is done.
            self::TurnEnded => $run->turnsAsked() > 0 && $this->turnsEndedOf($run) >= $run->turnsAsked(),
            self::Interrupted => DriverRequest::hasAppliedOf(
                (string) $run->lastAgent()->current_session_id,
                DriverOperation::Interrupt,
            ),
            self::Stopped => $this->hasStopped($run),
            self::ChallengeShown, self::SignedIn, self::SignInFailed => $this->hasSignInFact($run),
            self::Installed => $run->installerExit() === 0 && Host::query()->exists(),
            self::Connected => $run->isConnected(),
            self::RelayHeartbeat => $run->hasRelayHeartbeat(),
            self::InstructionsAnswered => HostInstruction::hasAnsweredAllSince($run->startedAt),
        };
    }

    private function hasStopped(ScenarioRun $run): bool
    {
        $session = AgentSession::query()->find($run->lastAgent()->current_session_id);

        return $session === null || $session->hasEnded();
    }

    private function hasSignInFact(ScenarioRun $run): bool
    {
        $attempt = SignInAttempt::findForJournal((string) $run->signInAttempt());

        if ($attempt === null) {
            return false;
        }

        return match ($this) {
            self::ChallengeShown => $attempt->isWaiting(),
            self::SignedIn => $attempt->hasSucceeded(),
            self::SignInFailed => $attempt->isFailed(),
            default => false,
        };
    }

    /**
     * How many turns of the run's last agent's session ended.
     */
    private function turnsEndedOf(ScenarioRun $run): int
    {
        return DriverRequest::countTurnsEndedOf((string) $run->lastAgent()->current_session_id);
    }

    /**
     * Whether the run's start was refused: its request refused, or the start it made ended on the host's refusal.
     */
    private function isStartRefused(ScenarioRun $run): bool
    {
        $request = SessionRequest::findUnderRequest($run->startRequest());

        if ($request === null || $request->isRefused()) {
            return $request !== null;
        }

        if ($request->session_id === null) {
            return false;
        }

        $start = SessionProcess::findLatestOfSession($request->session_id);

        return $start?->isRefused() === true;
    }
}
