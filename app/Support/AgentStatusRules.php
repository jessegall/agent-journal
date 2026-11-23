<?php

declare(strict_types=1);

namespace App\Support;

use App\Data\DriverRequestStatus;
use App\Enums\DriverOperation;
use App\Enums\DriverSwitchStage;
use App\Enums\HoldReason;
use App\Enums\ProcessStartState;
use App\Enums\RequestProgress;
use App\Enums\RuntimeActivity;
use App\Enums\SessionState;
use App\Enums\SessionStatus;
use App\Enums\StartDisposition;
use App\Enums\StartRefusalType;
use App\Enums\StartRemedyType;
use App\Enums\StartUnavailableReason;
use App\Enums\StatusActionType;

/**
 * Decides an agent's status from its evidence: the state, the words that name it and the actions it offers. Core's
 * own; the status it answers is the value it publishes.
 */
final class AgentStatusRules
{
    public static function of(AgentEvidence $evidence, StartRemedyWords $words): AgentStatus
    {
        if ($evidence->retired) {
            return new AgentStatus(
                SessionState::Retired,
                SessionState::Retired->label(),
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

        if ($request?->progress === RequestProgress::DeliveryUncertain) {
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
                SessionState::Unknown,
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
                SessionState::Unknown,
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
            : SessionState::Stopping->label();

        return self::labelled(SessionState::Stopping, $label, $evidence, [], $operation);
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
            DriverSwitchStage::Stopping => self::plain(SessionState::Stopping, $evidence, [], $operation),
            DriverSwitchStage::StopUnconfirmed => self::labelled(
                SessionState::Unknown,
                'Stop could not be confirmed',
                $evidence,
                $reconcile,
                $operation,
                $reconcileReason,
            ),
            DriverSwitchStage::StartUnconfirmed => self::labelled(
                SessionState::Unknown,
                'Start could not be confirmed',
                $evidence,
                $reconcile,
                $operation,
                $reconcileReason,
            ),
            DriverSwitchStage::LaunchFailed => self::labelled(
                SessionState::Failed,
                $stage->label(),
                $evidence,
                [StatusAction::retry('switch')],
                $operation,
            ),
            default => self::labelled(SessionState::Starting, $stage->label(), $evidence, [], $operation),
        };
    }

    // A fresh hold of the current process that waits for someone takes over the display, with its own words and the
    // place it is answered; a login or a secret is answered in the driver or on the host, never in chat.
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
            HoldReason::LoginRequired => SessionState::WaitingForSignIn,
            HoldReason::Compacting => SessionState::Working,
            default => SessionState::Idle,
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

        $working = $evidence->canStop ? [...$switch, StatusAction::of(StatusActionType::Interrupt)] : $switch;

        if ($evidence->processStart?->isStarting() === true) {
            return self::isWakeRefused($evidence->request) ? self::unknown($evidence) : self::starting($evidence);
        }

        $verification = self::verification($evidence);

        if ($verification !== null) {
            return $verification;
        }

        if ($evidence->sessionStatus === SessionStatus::Silent) {
            return self::unknown($evidence);
        }

        if ($runtime === null) {
            return $evidence->expectsRuntime ? self::unknown($evidence) : self::plain(
                SessionState::Working,
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
            RuntimeActivity::Running => self::plain(SessionState::Working, $evidence, $working),
            RuntimeActivity::Idle => self::plain(SessionState::Idle, $evidence, $switch),
            RuntimeActivity::Starting => self::plain(SessionState::Starting, $evidence, []),
            RuntimeActivity::Interrupting => self::plain(SessionState::Interrupting, $evidence, []),
            RuntimeActivity::Stopping => self::plain(SessionState::Stopping, $evidence, []),
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

        if ($evidence->canCancelLaunch) {
            $actions[] = StatusAction::of(StatusActionType::CancelStart);
        }

        return self::labelled($state, $state->label(), $evidence, $actions, null, $state->reason());
    }

    /**
     * Whether the host refused the session's wake without proving it never started a process: the launch stays for
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
            SessionState::Failed,
            $evidence,
            [StatusAction::retry($name)],
            self::operationOf($request),
        );
    }

    // No live session: the latest launch decides, else the agent is stopped and may start.
    private static function withoutSession(AgentEvidence $evidence, StartRemedyWords $words): AgentStatus
    {
        $launch = $evidence->launch;

        if ($launch?->disposition === StartDisposition::Accepted) {
            return self::starting($evidence);
        }

        if ($launch?->disposition === StartDisposition::Refused) {
            return self::refused($evidence, $launch, $words);
        }

        $actions = [StatusAction::of(StatusActionType::Start)];

        if ($evidence->resumable) {
            $actions[] = StatusAction::of(StatusActionType::Resume);
        }

        return self::plain(SessionState::Stopped, $evidence, $actions);
    }

    private static function starting(AgentEvidence $evidence): AgentStatus
    {
        $launch = $evidence->launch;
        $actions = $evidence->canCancelLaunch ? [StatusAction::of(StatusActionType::CancelStart)] : [];

        $operation = $launch === null ? null : new StatusOperation(
            $launch->requestId,
            'start',
            $launch->version(),
            1,
        );

        return self::plain(SessionState::Starting, $evidence, $actions, $operation);
    }

    private static function refused(
        AgentEvidence $evidence,
        LaunchOutcome $launch,
        StartRemedyWords $words,
    ): AgentStatus {
        $reason = StartRefusalCodes::reasonOf((string) $launch->refusalReason);
        $remedy = $reason->remedy();

        $state = match ($reason) {
            StartRefusalType::CapacityUnavailable => SessionState::NoCapacity,
            StartUnavailableReason::NeedsSignIn => SessionState::WaitingForSignIn,
            default => SessionState::Refused,
        };

        $primary = match ($remedy->type) {
            StartRemedyType::CheckCapacity => [StatusAction::of(StatusActionType::CheckCapacity)],
            StartRemedyType::OperatorInstruction, StartRemedyType::ConnectHost => [],
            default => [new StatusAction(StatusActionType::Start, $remedy->operatorText())],
        };

        if ($reason === StartUnavailableReason::NeedsSignIn) {
            $primary = [StatusAction::of(StatusActionType::SignIn)];
        }

        return new AgentStatus(
            $state,
            $state->label(),
            $reason->explanation(),
            $words->textOf($remedy),
            new StatusOperation($launch->requestId, 'start', $launch->version(), 1),
            null,
            null,
            [...$primary, StatusAction::of(StatusActionType::Dismiss)],
        );
    }

    private static function unknown(AgentEvidence $evidence, StatusOperation|null $operation = null): AgentStatus
    {
        return self::plain(
            SessionState::Unknown,
            $evidence,
            [StatusAction::of(StatusActionType::CheckStatus)],
            $operation,
        );
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
        SessionState $state,
        AgentEvidence $evidence,
        array $actions,
        StatusOperation|null $operation = null,
    ): AgentStatus {
        return self::labelled($state, $state->label(), $evidence, $actions, $operation);
    }

    /**
     * A status beside the current session, with the refused command that stays shown until it is replaced or
     * dismissed; only a launch refusal is the viewer's to dismiss.
     *
     * @param  list<StatusAction>  $actions
     */
    private static function labelled(
        SessionState $state,
        string $label,
        AgentEvidence $evidence,
        array $actions,
        StatusOperation|null $operation = null,
        string|null $reason = null,
    ): AgentStatus {
        $commandOutcome = self::commandOutcomeOf($evidence);

        $dismiss = $commandOutcome !== null && $evidence->showsLaunchRefusal()
            ? [StatusAction::of(StatusActionType::Dismiss)]
            : [];

        return new AgentStatus(
            $state,
            $commandOutcome === null ? $label : "{$label} · {$commandOutcome}",
            $reason,
            null,
            $operation,
            $commandOutcome,
            $evidence->runtime?->observationAgeSeconds,
            [...$actions, ...$dismiss],
            $evidence->processStart === ProcessStartState::Running,
        );
    }

    /**
     * The refused command shown beside a live session: a refused switch, or a refused launch the viewer has not
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

        return $evidence->showsLaunchRefusal() ? 'Start refused' : null;
    }
}
