<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Actions\StartSessions;
use App\Agents\Enums\DriverSwitchStage;
use App\Agents\Enums\DriverVariant;
use App\Agents\Enums\ProcessStartState;
use App\Agents\Exceptions\DriverSwitchStageRefused;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Models\DriverSwitch;
use App\Agents\Values\ChosenAccount;
use App\Agents\Values\DriverSwitchTarget;
use App\Drivers\Enums\HookDriver;
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
        'start_tokens',
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
        $agent = Agent::create('Main agent', 'main-agent');
        $this->session = $this->app->make(StartSessions::class)
            ->start($agent, TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;
    }

    public function test_a_switch_moves_from_request_to_a_confirmed_new_session(): void
    {
        $switch = $this->switch();

        $switch->markPreflighted();
        $switch->beginStopping();
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
        $switch->beginStopping();

        $switch->recheck(null);
        $this->assertSame(DriverSwitchStage::StopUnconfirmed, $switch->stage);
        $switch->recheck(ProcessStartState::Stopped);
        $this->assertSame(DriverSwitchStage::Stopped, $switch->stage);

        $switch->beginStarting(strtolower((string) Str::ulid()));
        $switch->recheck(ProcessStartState::Stopped);
        $this->assertSame(DriverSwitchStage::LaunchFailed, $switch->stage);
    }

    public function test_a_failed_launch_offers_a_retry_of_the_same_request_once(): void
    {
        $switch = $this->switch();
        $switch->markPreflighted();
        $switch->beginStopping();
        $switch->markStopped();
        $switch->beginStarting(strtolower((string) Str::ulid()));
        $switch->failLaunch('refused');
        $requestId = $switch->request_id;

        $switch->retryLaunch();

        $this->assertSame(
            [DriverSwitchStage::Stopped, $requestId, null],
            [$switch->stage, $switch->request_id, $switch->replacement_session_id],
        );
        $this->expectException(DriverSwitchStageRefused::class);
        $switch->retryLaunch();
    }

    private function switch(): DriverSwitch
    {
        return DriverSwitch::create(
            strtolower((string) Str::ulid()),
            $this->session,
            0,
            new DriverSwitchTarget(
                HookDriver::Codex,
                DriverVariant::Headless,
                new ChosenAccount(strtolower((string) Str::ulid()), 0),
                null,
                false,
            ),
            'owner',
        );
    }
}
