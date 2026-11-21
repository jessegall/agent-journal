<?php

declare(strict_types=1);

namespace Tests\Unit\Agents;

use App\Agents\Contracts\HostOperatorAccess;
use App\Agents\Data\DriverRequestStatus;
use App\Agents\Enums\DriverOperation;
use App\Agents\Enums\DriverSwitchStage;
use App\Agents\Enums\ExpectedTiming;
use App\Agents\Enums\HoldReason;
use App\Agents\Enums\ProcessStartState;
use App\Agents\Enums\RequestOutcome;
use App\Agents\Enums\RequestProgress;
use App\Agents\Enums\RuntimeActivity;
use App\Agents\Enums\SessionState;
use App\Agents\Enums\SessionStatus;
use App\Agents\Enums\StartDisposition;
use App\Agents\Enums\StatusActionType;
use App\Agents\Support\AgentEvidence;
use App\Agents\Support\AgentStatus;
use App\Agents\Support\LaunchOutcome;
use App\Agents\Support\RuntimeEvidence;
use App\Agents\Support\StartRemedyWords;
use App\Agents\Support\StatusAction;
use App\Agents\Support\SwitchEvidence;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;

/**
 * An agent's status follows its evidence in the design's order, never session existence alone: each row names the
 * state, the label and the actions doc 96 gives for it.
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
                    start: ProcessStartState::Pending,
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
                ['recheck-switch'],
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
        $status = AgentStatus::of($evidence, self::words(false));

        $this->assertSame(
            [$state, $label, $actions],
            [
                $status->sessionState,
                $status->label,
                array_map(fn (StatusAction $action) => $action->type->value, $status->actions),
            ],
        );
    }

    public function test_a_refusal_names_its_reason_and_the_members_wording_of_its_remedy(): void
    {
        $evidence = self::stopped(self::launch(StartDisposition::Refused, 'image-unverified'));

        $member = AgentStatus::of($evidence, self::words(false));
        $operator = AgentStatus::of($evidence, self::words(true));

        $this->assertSame(
            [
                'The host could not verify its agent image.',
                'Ask your host operator to verify the host image.',
                'Verify the host image',
            ],
            [$member->reason, $member->remedy, $operator->remedy],
        );
    }

    public function test_a_retired_agent_offers_no_lifecycle_command(): void
    {
        $evidence = new AgentEvidence(true, null, null, null, null, false, null, null, null, true, false);

        $status = AgentStatus::of($evidence, self::words(false));

        $this->assertSame([SessionState::Retired, []], [$status->sessionState, $status->actions]);
    }

    public function test_a_stopped_agent_with_a_saved_conversation_also_offers_resume(): void
    {
        $evidence = new AgentEvidence(false, null, null, null, null, false, null, null, null, true, false);

        $status = AgentStatus::of($evidence, self::words(false));

        $this->assertSame(
            [StatusActionType::Start, StatusActionType::Resume],
            array_map(fn (StatusAction $action) => $action->type, $status->actions),
        );
    }

    private static function live(
        RuntimeEvidence|null $runtime,
        SessionStatus $status = SessionStatus::Active,
        SwitchEvidence|null $switch = null,
        LaunchOutcome|null $launch = null,
        ProcessStartState $start = ProcessStartState::Running,
        DriverRequestStatus|null $request = null,
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

    private static function stopped(LaunchOutcome|null $launch): AgentEvidence
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

    private static function launch(StartDisposition $disposition, string|null $reason = null): LaunchOutcome
    {
        return new LaunchOutcome(
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
