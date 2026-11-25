<?php

declare(strict_types=1);

namespace Tests\Unit\Agents;

use App\Contracts\Hosts\HostOperatorAccess;
use App\Data\Agents\DriverRequestStatus;
use App\Enums\Agents\SessionProcessState;
use App\Enums\Agents\StatusActionType;
use App\Enums\Drivers\DriverOperation;
use App\Enums\Drivers\DriverSwitchStage;
use App\Enums\Drivers\ExpectedTiming;
use App\Enums\Drivers\HoldReason;
use App\Enums\Drivers\RequestOutcome;
use App\Enums\Drivers\RequestProgress;
use App\Enums\Runs\RuntimeActivity;
use App\Enums\Sessions\SessionState;
use App\Enums\Sessions\SessionStatus;
use App\Enums\Sessions\StartDisposition;
use App\Enums\Sessions\StartReadiness;
use App\Support\AgentEvidence;
use App\Support\AgentStatusRules;
use App\Support\HoldCopy;
use App\Support\SessionStartOutcome;
use App\Support\RuntimeEvidence;
use App\Support\StartRemedyWords;
use App\Support\StatusAction;
use App\Support\SwitchEvidence;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

/**
 * An agent's status follows its evidence in the design's order, never session existence alone: each row names the
 * state, the label and the actions the design gives for it.
 */
final class AgentStatusTest extends TestCase
{
    private const string SESSION = '01jd8x0g9m3qz6v4k2t7r5w1ce';

    private const string REQUEST = '01jd8x0g9m3qz6v4k2t7r5w1cf';

    /**
     * @return array<string, array{AgentEvidence, SessionState, string, list<string>}>
     */
    public static function evidence(): array
    {
        return [
            'idle' => [
                self::live(self::runtime(RuntimeActivity::Idle)),
                SessionState::Idle,
                'Idle',
                ['switch'],
            ],
            'silent' => [
                self::live(self::runtime(RuntimeActivity::Running), SessionStatus::Silent),
                SessionState::Unknown,
                'Status unknown',
                ['check-status'],
            ],
            'runtime-less' => [
                self::live(null),
                SessionState::Unknown,
                'Status unknown',
                ['check-status'],
            ],
            'stale observation' => [
                self::live(self::runtime(RuntimeActivity::Running, isStale: true)),
                SessionState::Unknown,
                'Status unknown',
                ['check-status'],
            ],
            'refused and ended' => [
                self::stopped(self::launch(StartDisposition::Refused, 'capacity-unavailable')),
                SessionState::NoCapacity,
                'No capacity',
                ['check-capacity', 'dismiss'],
            ],
            'sessionless refusal' => [
                self::stopped(self::launch(StartDisposition::Refused, 'model-required')),
                SessionState::Refused,
                'Start refused',
                ['start', 'dismiss'],
            ],
            'lost reply' => [
                self::stopped(self::launch(StartDisposition::Accepted)),
                SessionState::Starting,
                'Starting',
                [],
            ],
            'later independent start' => [
                self::live(self::runtime(RuntimeActivity::Idle), launch: self::launch(StartDisposition::Started)),
                SessionState::Idle,
                'Idle',
                ['switch'],
            ],
            'dismissed refusal after reload' => [
                self::stopped(null),
                SessionState::Stopped,
                'Stopped',
                ['start'],
            ],
            'replayed sessionless receipt' => [
                self::stopped(self::launch(StartDisposition::Refused, 'image-unverified')),
                SessionState::Refused,
                'Start refused',
                ['dismiss'],
            ],
            'late old-generation Running' => [
                self::live(self::runtime(RuntimeActivity::Starting)),
                SessionState::Starting,
                'Starting',
                [],
            ],
            'generic refusal of the initial wake' => [
                self::live(
                    self::runtime(RuntimeActivity::Starting),
                    start: SessionProcessState::Pending,
                    request: self::refusedWake(),
                ),
                SessionState::Unknown,
                'Status unknown',
                ['check-status'],
            ],
            'sign-in hold' => [
                self::live(self::runtime(RuntimeActivity::Idle, HoldReason::LoginRequired)),
                SessionState::WaitingForSignIn,
                'Waiting for sign-in',
                ['sign-in'],
            ],
            'first-run setup with a terminal' => [
                self::live(self::runtime(RuntimeActivity::Starting, HoldReason::OnboardingRequired), isTerminal: true),
                SessionState::Idle,
                'Finish setup',
                ['open-terminal'],
            ],
            'first-run setup without a terminal' => [
                self::live(self::runtime(RuntimeActivity::Starting, HoldReason::OnboardingRequired)),
                SessionState::Idle,
                'Finish setup',
                [],
            ],
            'unreadable screen' => [
                self::live(self::runtime(RuntimeActivity::Idle, HoldReason::ScreenUnreadable)),
                SessionState::Idle,
                "The journal can't read the driver screen.",
                [],
            ],
            'navigation hold' => [
                self::live(self::runtime(RuntimeActivity::Idle, HoldReason::NavigationNeeded)),
                SessionState::Idle,
                'Waiting for the main desk',
                [],
            ],
            'refused switch beside the idle session' => [
                self::live(
                    self::runtime(RuntimeActivity::Idle),
                    switch: new SwitchEvidence('01jd8x0g9m3qz6v4k2t7r5w1cg', DriverSwitchStage::Refused, 1),
                ),
                SessionState::Idle,
                'Idle · Switch refused',
                ['switch'],
            ],
            'unconfirmed stop of a switch' => [
                self::live(
                    self::runtime(RuntimeActivity::Running),
                    switch: new SwitchEvidence('01jd8x0g9m3qz6v4k2t7r5w1cg', DriverSwitchStage::StopUnconfirmed, 4),
                ),
                SessionState::Unknown,
                'Stop could not be confirmed',
                ['check-status'],
            ],
        ];
    }

    /**
     * @param  list<string>  $actions
     */
    #[DataProvider('evidence')]
    public function test_the_evidence_decides_the_state_label_and_actions(
        AgentEvidence $evidence,
        SessionState $state,
        string $label,
        array $actions,
    ): void {
        $status = AgentStatusRules::of($evidence, self::words(false));

        $this->assertSame(
            [$state, $label, $actions],
            [
                $status->sessionState,
                $status->label,
                array_map(fn (StatusAction $action) => $action->type->value, $status->actions),
            ],
        );
    }

    /**
     * @return array<string, array{StartReadiness, SessionState, list<string>}>
     */
    public static function readiness(): array
    {
        return [
            'accepted' => [StartReadiness::Accepted, SessionState::Verifying, ['check-status', 'cancel-start']],
            'preparing' => [StartReadiness::PreparingIdentity, SessionState::Verifying, ['check-status', 'cancel-start']],
            'uncertain' => [StartReadiness::Uncertain, SessionState::Unverified, ['check-status', 'cancel-start']],
            'ready' => [StartReadiness::Ready, SessionState::Idle, ['switch']],
            'cancelled' => [StartReadiness::Cancelled, SessionState::Idle, ['switch']],
        ];
    }

    /**
     * @param  list<string>  $actions
     */
    #[DataProvider('readiness')]
    public function test_a_start_that_has_not_proved_its_conversation_is_verifying_with_check_status_and_cancel(
        StartReadiness $readiness,
        SessionState $state,
        array $actions,
    ): void {
        $evidence = new AgentEvidence(
            false,
            self::SESSION,
            SessionStatus::Active,
            SessionProcessState::Running,
            self::runtime(RuntimeActivity::Idle),
            true,
            null,
            null,
            null,
            false,
            $readiness->isUnverified(),
            readiness: $readiness,
        );

        $status = AgentStatusRules::of($evidence, self::words(false));

        $this->assertSame(
            [$state, $state->label(), $state->reason(), $actions],
            [
                $status->sessionState,
                $status->label,
                $status->reason,
                array_map(fn (StatusAction $action) => $action->type->value, $status->actions),
            ],
        );
    }

    public function test_a_refusal_names_its_reason_and_the_members_wording_of_its_remedy(): void
    {
        $evidence = self::stopped(self::launch(StartDisposition::Refused, 'image-unverified'));

        $member = AgentStatusRules::of($evidence, self::words(false));
        $operator = AgentStatusRules::of($evidence, self::words(true));

        $this->assertSame(
            [
                'The host could not verify its agent image.',
                'Ask your host operator to verify the host image.',
                'Verify the host image',
            ],
            [$member->reason, $member->remedy, $operator->remedy],
        );
    }

    public function test_a_setup_hold_without_a_terminal_asks_the_host_operator(): void
    {
        $evidence = self::live(self::runtime(RuntimeActivity::Starting, HoldReason::OnboardingRequired));

        $status = AgentStatusRules::of($evidence, self::words(false));

        $this->assertSame(HoldCopy::of(HoldReason::OnboardingRequired, hasTerminal: false)->reason, $status->reason);
    }

    /**
     * A wake nobody knows the end of carried nothing of its own, so it does not leave the session
     * on Status unknown; an uncertain delivery still does, until a user settles it.
     */
    public function test_an_uncertain_wake_leaves_the_session_as_its_runtime_reports_it(): void
    {
        $idle = self::runtime(RuntimeActivity::Idle);

        $afterWake = AgentStatusRules::of(
            self::live($idle, request: self::uncertain(DriverOperation::Wake)),
            self::words(false),
        );
        $afterDelivery = AgentStatusRules::of(
            self::live($idle, request: self::uncertain(DriverOperation::Deliver)),
            self::words(false),
        );

        $this->assertSame([SessionState::Idle, SessionState::Unknown], [$afterWake->sessionState, $afterDelivery->sessionState]);
    }

    /**
     * A start that can no longer be cancelled still has a way out: its session is stopped.
     */
    public function test_a_start_past_cancelling_offers_stop_to_an_actor_allowed_to_stop(): void
    {
        $starting = new AgentEvidence(
            false,
            self::SESSION,
            SessionStatus::Active,
            SessionProcessState::Starting,
            self::runtime(RuntimeActivity::Idle),
            true,
            null,
            null,
            null,
            false,
            false,
            false,
            true,
        );

        $status = AgentStatusRules::of($starting, self::words(false));

        $this->assertSame(SessionState::Starting, $status->sessionState);
        $this->assertSame(
            [StatusActionType::Stop],
            array_map(fn (StatusAction $action) => $action->type, $status->actions),
        );
    }

    /**
     * A session nobody can vouch for can still be ended; Status unknown was a dead end.
     */
    public function test_an_unknown_state_offers_stop_beside_check_status_to_an_actor_allowed_to_stop(): void
    {
        $unvouched = new AgentEvidence(
            false,
            self::SESSION,
            SessionStatus::Active,
            SessionProcessState::Running,
            self::runtime(RuntimeActivity::Idle, isStale: true),
            true,
            null,
            null,
            null,
            false,
            false,
            false,
            true,
        );

        $status = AgentStatusRules::of($unvouched, self::words(false));

        $this->assertSame(SessionState::Unknown, $status->sessionState);
        $this->assertSame(
            [StatusActionType::CheckStatus, StatusActionType::Stop],
            array_map(fn (StatusAction $action) => $action->type, $status->actions),
        );
    }

    public function test_a_live_session_offers_stop_only_to_an_actor_allowed_to_stop(): void
    {
        $allowed = new AgentEvidence(
            false,
            self::SESSION,
            SessionStatus::Active,
            SessionProcessState::Running,
            self::runtime(RuntimeActivity::Running),
            true,
            null,
            null,
            null,
            false,
            false,
            false,
            true,
        );

        $status = AgentStatusRules::of($allowed, self::words(false));
        $refused = AgentStatusRules::of(self::live(self::runtime(RuntimeActivity::Running)), self::words(false));

        $this->assertSame(
            [
                [StatusActionType::Stop, StatusActionType::Switch, StatusActionType::Interrupt],
                [StatusActionType::Switch],
            ],
            [
                array_map(fn (StatusAction $action) => $action->type, $status->actions),
                array_map(fn (StatusAction $action) => $action->type, $refused->actions),
            ],
        );
    }

    public function test_only_an_actor_allowed_to_reconcile_may_continue_an_unconfirmed_switch(): void
    {
        $evidence = new AgentEvidence(
            false,
            self::SESSION,
            SessionStatus::Active,
            SessionProcessState::Running,
            self::runtime(RuntimeActivity::Running),
            true,
            new SwitchEvidence('01jd8x0g9m3qz6v4k2t7r5w1cg', DriverSwitchStage::StartUnconfirmed, 4),
            null,
            null,
            false,
            false,
            canReconcile: true,
        );

        $status = AgentStatusRules::of($evidence, self::words(false));

        $this->assertSame(
            ['Start could not be confirmed', 'If the host confirms this step, the approved switch can continue.'],
            [$status->label, $status->reason],
        );
        $this->assertSame(StatusActionType::RecheckSwitch, $status->actions[0]->type);
    }

    public function test_a_retired_agent_offers_no_lifecycle_command(): void
    {
        $evidence = new AgentEvidence(true, null, null, null, null, false, null, null, null, true, false);

        $status = AgentStatusRules::of($evidence, self::words(false));

        $this->assertSame([SessionState::Retired, []], [$status->sessionState, $status->actions]);
    }

    public function test_a_stopped_agent_with_a_saved_conversation_also_offers_resume(): void
    {
        $evidence = new AgentEvidence(false, null, null, null, null, false, null, null, null, true, false);

        $status = AgentStatusRules::of($evidence, self::words(false));

        $this->assertSame(
            [StatusActionType::Start, StatusActionType::Resume],
            array_map(fn (StatusAction $action) => $action->type, $status->actions),
        );
    }

    private static function live(
        RuntimeEvidence|null $runtime,
        SessionStatus $status = SessionStatus::Active,
        SwitchEvidence|null $switch = null,
        SessionStartOutcome|null $launch = null,
        SessionProcessState $start = SessionProcessState::Running,
        DriverRequestStatus|null $request = null,
        bool $isTerminal = false,
    ): AgentEvidence {
        return new AgentEvidence(
            false,
            self::SESSION,
            $status,
            $start,
            $runtime,
            true,
            $switch,
            $request,
            $launch,
            false,
            false,
            $isTerminal,
        );
    }

    private static function refusedWake(): DriverRequestStatus
    {
        return new DriverRequestStatus(
            requestId: '01jd8x0g9m3qz6v4k2t7r5w1cj',
            sequence: 1,
            operation: DriverOperation::Wake,
            progress: RequestProgress::Failed,
            outcome: RequestOutcome::Refused,
            expectedTiming: ExpectedTiming::Unknown,
            changedAt: null,
            hold: HoldReason::None,
            canRetry: true,
        );
    }

    private static function uncertain(DriverOperation $operation): DriverRequestStatus
    {
        return new DriverRequestStatus(
            requestId: '01jd8x0g9m3qz6v4k2t7r5w1cj',
            sequence: 2,
            operation: $operation,
            progress: RequestProgress::DeliveryUncertain,
            outcome: null,
            expectedTiming: ExpectedTiming::Unknown,
            changedAt: null,
            hold: HoldReason::None,
        );
    }

    private static function stopped(SessionStartOutcome|null $launch): AgentEvidence
    {
        return new AgentEvidence(false, null, null, null, null, false, null, null, $launch, false, false);
    }

    private static function runtime(
        RuntimeActivity $activity,
        HoldReason $hold = HoldReason::None,
        bool $isStale = false,
    ): RuntimeEvidence {
        return new RuntimeEvidence($activity, $hold, $isStale, $isStale ? 600 : 3, 3);
    }

    private static function launch(StartDisposition $disposition, string|null $reason = null): SessionStartOutcome
    {
        return new SessionStartOutcome(
            '01jd8x0g9m3qz6v4k2t7r5w1ch',
            self::REQUEST,
            $disposition,
            $disposition === StartDisposition::Started ? self::SESSION : null,
            $reason,
        );
    }

    private static function words(bool $operates): StartRemedyWords
    {
        return new StartRemedyWords(new readonly class($operates) implements HostOperatorAccess
        {
            public function __construct(private bool $operates) {}

            public function isGranted(): bool
            {
                return $this->operates;
            }
        });
    }
}
