<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Drivers\DriverCatalogue;
use App\Enums\Agents\SessionProcessState;
use App\Enums\Drivers\DriverSwitchStage;
use App\Enums\Drivers\DriverType;
use App\Enums\Runs\RuntimeActivity;
use App\Exceptions\DriverSwitchStageRefused;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Agents\AgentSession;
use App\Models\Drivers\DriverSwitch;
use App\Models\Sessions\SessionProcess;
use App\Support\ActorContext;
use App\Support\DefaultDrivers;
use App\Support\StartSessions;
use App\Values\ChosenAccount;
use App\Values\DriverSwitchTarget;
use App\Values\OwnerAuthority;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * A switch of an agent's driver session is one record: it moves through its stages in order, refuses a jump, and
 * an agent has one open switch at most.
 */
final class DriverSwitchTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'driver_switches',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'links',
        'command_receipts',
    ];

    private AgentSession $session;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );
        $agent = Agent::create('Main agent', 'main-agent', $this->localProject());
        $this->session = $this->app->make(StartSessions::class)
            ->start($agent, TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;
    }

    public function test_a_switch_moves_from_request_to_a_confirmed_new_session(): void
    {
        $switch = $this->switch();

        $switch->markPreflighted();
        $switch->beginStopping(null);
        $this->assertTrue($switch->stage->blocksWriter());
        $switch->markStopped();
        $switch->beginStarting(strtolower((string) Str::ulid()));
        $switch->confirm();

        $switch->refresh();
        $this->assertSame(DriverSwitchStage::Confirmed, $switch->stage);
        $this->assertTrue($switch->stage->isFinal());
        $this->assertNull(DriverSwitch::openOf($this->session->agent_id));
    }

    public function test_a_jump_past_its_stages_is_refused(): void
    {
        $switch = $this->switch();

        $this->expectException(DriverSwitchStageRefused::class);

        $switch->beginStarting(strtolower((string) Str::ulid()));
    }

    public function test_an_agent_has_one_open_switch_at_most(): void
    {
        $open = $this->switch();
        $this->assertSame($open->id, DriverSwitch::openOf($this->session->agent_id)?->id);

        $this->expectException(UniqueConstraintViolationException::class);

        $this->switch();
    }

    public function test_an_unconfirmed_stop_moves_on_once_the_host_proves_it_and_an_ended_start_fails(): void
    {
        $switch = $this->switch();
        $switch->markPreflighted();
        $switch->beginStopping(null);

        $switch->recheck(null, null);
        $this->assertSame(DriverSwitchStage::StopUnconfirmed, $switch->stage);
        $switch->recheck(SessionProcessState::Stopped, null);
        $this->assertSame(DriverSwitchStage::Stopped, $switch->stage);

        $switch->beginStarting(strtolower((string) Str::ulid()));
        $switch->recheck(SessionProcessState::Stopped, null);
        $this->assertSame(DriverSwitchStage::StartFailed, $switch->stage);
    }

    public function test_a_failed_start_offers_a_retry_of_the_same_request_once(): void
    {
        $switch = $this->switch();
        $switch->markPreflighted();
        $switch->beginStopping(null);
        $switch->markStopped();
        $switch->beginStarting(strtolower((string) Str::ulid()));
        $switch->failStart('refused');
        $requestId = $switch->request_id;

        $switch->retryStart();

        $this->assertSame(
            [DriverSwitchStage::Stopped, $requestId, null],
            [$switch->stage, $switch->request_id, $switch->replacement_session_id],
        );
        $this->expectException(DriverSwitchStageRefused::class);
        $switch->retryStart();
    }

    public function test_a_stale_running_from_before_the_stop_does_not_cancel_the_switch(): void
    {
        $switch = $this->switch();
        $switch->markPreflighted();
        $source = $this->sourceRuntime(observations: 3, activity: RuntimeActivity::Running);
        $switch->beginStopping($source);

        $switch->recheck(SessionProcessState::Running, $source);

        $this->assertSame(DriverSwitchStage::StopUnconfirmed, $switch->stage);
    }

    public function test_a_running_observed_after_the_stop_cancels_the_switch(): void
    {
        $switch = $this->switch();
        $switch->markPreflighted();
        $source = $this->sourceRuntime(observations: 3, activity: RuntimeActivity::Running);
        $switch->beginStopping($source);
        $later = $this->sourceRuntime(observations: 4, activity: RuntimeActivity::Running);

        $switch->recheck(SessionProcessState::Running, $later);

        $this->assertSame(DriverSwitchStage::Cancelled, $switch->stage);
    }

    public function test_both_unconfirmed_legs_block_another_writer_and_a_target_end_fails_its_start_alone(): void
    {
        $switch = $this->switch();
        $switch->markPreflighted();
        $switch->beginStopping(null);
        $switch->recheck(null, null);
        $this->assertTrue($switch->stage->blocksWriter());

        $switch->recheck(SessionProcessState::Stopped, null);
        $switch->beginStarting(strtolower((string) Str::ulid()));
        $switch->recheck(null, null);
        $this->assertSame(DriverSwitchStage::StartUnconfirmed, $switch->stage);
        $this->assertTrue($switch->stage->blocksWriter());

        $switch->recheck(SessionProcessState::Stopped, null);
        $this->assertSame(DriverSwitchStage::StartFailed, $switch->stage);
        $switch->retryStart();
        $this->assertSame(DriverSwitchStage::Stopped, $switch->stage);
    }

    public function test_a_late_running_after_the_replacement_ended_confirms_nothing(): void
    {
        $start = new SessionProcess();
        $start->state = SessionProcessState::Stopped;

        $this->assertFalse($start->recordRunning('execution-late'));
        $this->assertSame(SessionProcessState::Stopped, $start->state);
    }

    /**
     * A source runtime as the switch reads it: how many observations the host reported and what it does.
     */
    private function sourceRuntime(int $observations, RuntimeActivity $activity): AgentRuntime
    {
        $runtime = new AgentRuntime();
        $runtime->observation_sequence = $observations;
        $runtime->activity = $activity;

        return $runtime;
    }

    private function switch(): DriverSwitch
    {
        return DriverSwitch::create(
            strtolower((string) Str::ulid()),
            $this->session,
            0,
            new DriverSwitchTarget(
                DefaultDrivers::CODEX,
                DriverType::Headless,
                new ChosenAccount(strtolower((string) Str::ulid()), 0),
                null,
                false,
            ),
            $this->app->make(DriverCatalogue::class)->pinned(DefaultDrivers::CODEX, DriverType::Headless),
            'owner',
        );
    }
}
