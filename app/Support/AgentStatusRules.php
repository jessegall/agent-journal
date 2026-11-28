<?php

declare(strict_types=1);

namespace App\Support;

use App\Agents\Data\DriverRequestStatus;
use App\Agents\Drivers\Enums\DriverOperation;
use App\Agents\Drivers\Enums\DriverSwitchStage;
use App\Agents\Drivers\Enums\HoldReason;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Agents\Enums\SessionProcessStatus;
use App\Agents\Enums\StatusActionType;
use App\Processes\Enums\RuntimeActivity;
use App\Sessions\Enums\SessionActivityStatus;
use App\Sessions\Enums\SessionStatus;
use App\Sessions\Enums\StartDisposition;
use App\Sessions\Enums\StartRefusalType;
use App\Sessions\Enums\StartRemedyType;
use App\Sessions\Enums\StartUnavailableReason;
use App\Sessions\SessionStartOutcome;
use App\Sessions\StartRefusalCodes;
use App\Sessions\StartRemedyWords;

/**
 * Decides an agent's status from its evidence: the state, the words that name it and the actions it offers. Core's
 * own; the status it answers is the value it publishes.
 */
final class AgentStatusRules
{
    private const string BUILDING_IMAGE = 'Building its driver image';

    public static function of(AgentEvidence $evidence, StartRemedyWords $words): AgentStatus
    {
        if ($evidence->isRetired) {
            return new AgentStatus(
                SessionActivityStatus::Retired,
                SessionActivityStatus::Retired->label(),
                null,
                null,
                null,
                null,
                null,
                [],
            );
        }

        return self::underWay($evidence)
            ?? self::held($evidence)
            ?? ($evidence->hasLiveSession() ? self::live($evidence) : self::withoutSession($evidence, $words));
    }

    // An accepted stop, an open switch or a delivery whose result is unknown decides the status before anything else.
    private static function underWay(AgentEvidence $evidence): AgentStatus|null
    {
        if ($evidence->switch?->isUnderWay() === true) {
            return self::switching($evidence, $evidence->switch);
        }

        $request = $evidence->request;

        if ($request?->operation === DriverOperation::Stop && $evidence->hasLiveSession()) {
            return self::stopping($evidence, $request);
        }

        if ($request?->isUnsettledDelivery() === true) {
            return self::unknown($evidence, self::operationOf($request));
        }

        return null;
    }

    /**
     * An accepted stop of the live session decides until the exit of its generation is proved: Stopping while it is
     * under way or applied without that proof, waiting for helpers while they still run, unconfirmed when its delivery
     * is uncertain or the host falls silent, and Retry stop when it failed and may be sent again to the same target.
     */
    private static function stopping(AgentEvidence $evidence, DriverRequestStatus $stop): AgentStatus|null
    {
        $operation = self::operationOf($stop);
        $checkStatus = [StatusAction::of(StatusActionType::CheckStatus)];

        $isUnderWay = in_array($stop->progress, RequestProgress::open(), true)
            || $stop->progress === RequestProgress::Applied;

        $isSilent = $evidence->sessionStatus === SessionStatus::Silent;

        if ($stop->progress === RequestProgress::DeliveryUncertain || ($isUnderWay && $isSilent)) {
            return self::labelled(
                SessionActivityStatus::Unknown,
                'Stop could not be confirmed',
                $evidence,
                $checkStatus,
                $operation,
            );
        }

        if ($stop->progress === RequestProgress::Failed && $stop->canRetry) {
            return self::failedRequest($evidence, $stop);
        }

        $ended = match ($stop->progress) {
            RequestProgress::Superseded => 'Stop replaced',
            RequestProgress::Cancelled => 'Stop cancelled',
            RequestProgress::Unavailable => 'Stop unavailable',
            default => null,
        };

        if ($ended !== null) {
            return self::labelled(
                SessionActivityStatus::Unknown,
                $ended,
                $evidence,
                $checkStatus,
                $operation,
            );
        }

        if (! $isUnderWay) {
            return null;
        }

        $label = $stop->progress === RequestProgress::Accepted && $evidence->waitsOnHelpers
            ? 'Stopping · Waiting for helpers'
            : SessionActivityStatus::Stopping->label();

        return self::labelled(SessionActivityStatus::Stopping, $label, $evidence, [], $operation);
    }

    private static function switching(AgentEvidence $evidence, SwitchEvidence $switch): AgentStatus
    {
        $stage = $switch->stage;
        $operation = $switch->operation();

        // Only an actor allowed to reconcile may advance an unconfirmed leg; everyone else may only read it again.
        $reconcile = $evidence->canReconcile ? [StatusAction::of(StatusActionType::RecheckSwitch)] : [
            StatusAction::of(StatusActionType::CheckStatus),
        ];

        $reconcileReason = $evidence->canReconcile
            ? 'If the host confirms this step, the approved switch can continue.'
            : null;

        return match ($stage) {
            DriverSwitchStage::Stopping => self::plain(SessionActivityStatus::Stopping, $evidence, [], $operation),
            DriverSwitchStage::StopUnconfirmed => self::labelled(
                SessionActivityStatus::Unknown,
                'Stop could not be confirmed',
                $evidence,
                $reconcile,
                $operation,
                $reconcileReason,
            ),
            DriverSwitchStage::StartUnconfirmed => self::labelled(
                SessionActivityStatus::Unknown,
                'Start could not be confirmed',
                $evidence,
                $reconcile,
                $operation,
                $reconcileReason,
            ),
            DriverSwitchStage::StartFailed => self::labelled(
                SessionActivityStatus::Failed,
                $stage->label(),
                $evidence,
                [StatusAction::retry('switch')],
                $operation,
            ),
            default => self::labelled(SessionActivityStatus::Starting, $stage->label(), $evidence, [], $operation),
        };
    }

    // A fresh hold of the current process that waits for someone takes over the display, with its own words and the
    // place it is answered; a login or a secret is answered in the driver or on the host, never in a message.
    private static function held(AgentEvidence $evidence): AgentStatus|null
    {
        $runtime = $evidence->runtime;

        if (! $evidence->hasLiveSession() || $runtime === null || ! $runtime->isFresh()) {
            return null;
        }

        $hold = $runtime->hold;

        if ($hold === HoldReason::None) {
            return null;
        }

        $copy = HoldCopy::of($hold, $evidence->hasTerminal);

        $state = match ($hold) {
            HoldReason::LoginRequired => SessionActivityStatus::WaitingForSignIn,
            HoldReason::Compacting => SessionActivityStatus::Working,
            default => SessionActivityStatus::Idle,
        };

        return self::labelled($state, $copy->label, $evidence, $copy->actions, null, $copy->reason);
    }

    // A live session: its supervised start, its runtime's fresh activity, or unknown when neither can say.
    private static function live(AgentEvidence $evidence): AgentStatus
    {
        $runtime = $evidence->runtime;

        $switch = [StatusAction::of(StatusActionType::Switch)];

        if ($evidence->canStop) {
            array_unshift($switch, StatusAction::of(StatusActionType::Stop));
        }

        $workingActions = $evidence->canStop ? [
            ...$switch,
            StatusAction::of(StatusActionType::Interrupt),
        ] : $switch;

        if ($evidence->sessionProcess?->isStarting() === true) {
            if (self::isWakeRefused($evidence->request)) {
                return self::unknown($evidence);
            }

            return self::starting($evidence);
        }

        $verification = self::verification($evidence);

        if ($verification !== null) {
            return $verification;
        }

        if ($evidence->sessionStatus === SessionStatus::Silent) {
            return self::unknown($evidence);
        }

        if ($runtime === null) {
            if ($evidence->expectsRuntime) {
                return self::unknown($evidence);
            }

            return self::plain(
                SessionActivityStatus::Working,
                $evidence,
                $switch,
            );
        }

        if (! $runtime->isFresh()) {
            return self::unknown($evidence);
        }

        if ($evidence->request?->progress === RequestProgress::Failed && $evidence->request->canRetry) {
            return self::failedRequest($evidence, $evidence->request);
        }

        return match ($runtime->activity) {
            RuntimeActivity::Running => self::plain(SessionActivityStatus::Working, $evidence, $workingActions),
            RuntimeActivity::Idle => self::plain(SessionActivityStatus::Idle, $evidence, $switch),
            RuntimeActivity::Starting => self::plain(SessionActivityStatus::Starting, $evidence, []),
            RuntimeActivity::Interrupting => self::plain(SessionActivityStatus::Interrupting, $evidence, []),
            RuntimeActivity::Stopping => self::plain(SessionActivityStatus::Stopping, $evidence, []),
            RuntimeActivity::Stopped, RuntimeActivity::HostUnavailable => self::unknown($evidence),
        };
    }

    /**
     * A live session whose start has not proved its conversation yet holds its messages: Verifying while the proof may
     * still come, not verified once it did not, each with Check status and Cancel.
     */
    private static function verification(AgentEvidence $evidence): AgentStatus|null
    {
        $state = $evidence->readiness?->verificationState();

        if ($state === null) {
            return null;
        }

        $actions = [StatusAction::of(StatusActionType::CheckStatus)];

        if ($evidence->canCancelStart) {
            $actions[] = StatusAction::of(StatusActionType::CancelStart);
        }

        return self::labelled($state, $state->label(), $evidence, $actions, null, $state->reason());
    }

    /**
     * Whether the host refused the session's wake without proving it never started a process: the start stays for
     * reconciliation, neither starting nor ended.
     */
    private static function isWakeRefused(DriverRequestStatus|null $request): bool
    {
        return $request?->operation === DriverOperation::Wake
            && in_array($request->progress, [RequestProgress::Failed, RequestProgress::Unavailable], true);
    }

    private static function failedRequest(AgentEvidence $evidence, DriverRequestStatus $request): AgentStatus
    {
        $name = str_replace('_', ' ', $request->operation->value);

        return self::plain(
            SessionActivityStatus::Failed,
            $evidence,
            [StatusAction::retry($name)],
            self::operationOf($request),
        );
    }

    // No live session: the latest start decides, else the agent is stopped, and the next message starts it.
    private static function withoutSession(AgentEvidence $evidence, StartRemedyWords $words): AgentStatus
    {
        $start = $evidence->start;

        if ($start?->disposition === StartDisposition::Accepted) {
            return self::starting($evidence);
        }

        if ($start?->disposition === StartDisposition::Refused) {
            return self::refused($start, $words);
        }

        return self::plain(SessionActivityStatus::Stopped, $evidence, []);
    }

    private static function starting(AgentEvidence $evidence): AgentStatus
    {
        $start = $evidence->start;

        // A start past the point it can be cancelled has a session, which is stopped instead: no state is a dead end.
        $actions = match (true) {
            $evidence->canCancelStart => [StatusAction::of(StatusActionType::CancelStart)],
            $evidence->canStop && $evidence->hasLiveSession() => [StatusAction::of(StatusActionType::Stop)],
            default => [],
        };

        $operation = $start === null ? null : new StatusOperation(
            $start->requestId,
            'start',
            $start->version(),
            1,
        );

        // A start waits while its host builds the driver image it will run, and says so.
        if ($evidence->waitsForDriverImage) {
            $status = SessionActivityStatus::Starting;

            return self::labelled($status, self::BUILDING_IMAGE, $evidence, $actions, $operation);
        }

        return self::plain(SessionActivityStatus::Starting, $evidence, $actions, $operation);
    }

    private static function refused(SessionStartOutcome $start, StartRemedyWords $words): AgentStatus
    {
        $reason = StartRefusalCodes::reasonOf((string) $start->refusalReason);
        $remedy = $reason->remedy();

        $state = match ($reason) {
            StartRefusalType::CapacityUnavailable => SessionActivityStatus::NoCapacity,
            StartUnavailableReason::NeedsSignIn => SessionActivityStatus::WaitingForSignIn,
            default => SessionActivityStatus::Refused,
        };

        // A start the next message may try again offers no button: the remedy's words say what to change first.
        $primary = $remedy->type === StartRemedyType::CheckCapacity
            ? [StatusAction::of(StatusActionType::CheckCapacity)]
            : [];

        if ($reason === StartUnavailableReason::NeedsSignIn) {
            $primary = [StatusAction::of(StatusActionType::SignIn)];
        }

        return new AgentStatus(
            $state,
            $state->label(),
            $reason->explanation(),
            $words->textOf($remedy),
            new StatusOperation($start->requestId, 'start', $start->version(), 1),
            null,
            null,
            [...$primary, StatusAction::of(StatusActionType::Dismiss)],
        );
    }

    /**
     * A state nobody can vouch for offers a fresh look, and Stop while its session still stands: not knowing what a
     * session does is no reason to be unable to end it.
     */
    private static function unknown(AgentEvidence $evidence, StatusOperation|null $operation = null): AgentStatus
    {
        $actions = [StatusAction::of(StatusActionType::CheckStatus)];

        if ($evidence->canStop && $evidence->hasLiveSession()) {
            $actions[] = StatusAction::of(StatusActionType::Stop);
        }

        return self::plain(SessionActivityStatus::Unknown, $evidence, $actions, $operation);
    }

    private static function operationOf(DriverRequestStatus $request): StatusOperation
    {
        return new StatusOperation(
            $request->requestId,
            $request->operation->value,
            $request->progress->value,
            $request->rowVersion,
        );
    }

    /**
     * @param  list<StatusAction>  $actions
     */
    private static function plain(
        SessionActivityStatus $status,
        AgentEvidence $evidence,
        array $actions,
        StatusOperation|null $operation = null,
    ): AgentStatus {
        return self::labelled($status, $status->label(), $evidence, $actions, $operation);
    }

    /**
     * A status beside the current session, with the refused command that stays shown until it is replaced or
     * dismissed; only a start refusal is the viewer's to dismiss.
     *
     * @param  list<StatusAction>  $actions
     */
    private static function labelled(
        SessionActivityStatus $status,
        string $label,
        AgentEvidence $evidence,
        array $actions,
        StatusOperation|null $operation = null,
        string|null $reason = null,
    ): AgentStatus {
        $commandOutcome = self::commandOutcomeOf($evidence);

        $dismiss = $commandOutcome !== null && $evidence->isStartRefusalShown()
            ? [StatusAction::of(StatusActionType::Dismiss)]
            : [];

        return new AgentStatus(
            $status,
            $commandOutcome === null ? $label : "{$label} · {$commandOutcome}",
            $reason,
            null,
            $operation,
            $commandOutcome,
            $evidence->runtime?->observationAgeSeconds,
            [...$actions, ...$dismiss],
            $evidence->sessionProcess === SessionProcessStatus::Running,
        );
    }

    /**
     * The refused command shown beside a live session: a refused switch, or a refused start the viewer has not
     * dismissed.
     */
    private static function commandOutcomeOf(AgentEvidence $evidence): string|null
    {
        if (! $evidence->hasLiveSession()) {
            return null;
        }

        if ($evidence->switch?->stage === DriverSwitchStage::Refused) {
            return 'Switch refused';
        }

        if ($evidence->isStartRefusalShown()) {
            return 'Start refused';
        }

        return null;
    }
}
