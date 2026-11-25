<?php

declare(strict_types=1);

namespace Tests\Commands\Terminals;

use App\Contracts\Authorization\CurrentAuthorizer;
use App\Enums\Drivers\DriverOperation;
use App\Enums\Terminals\TerminalControlRefusal;
use App\Enums\Terminals\TerminalGrantStatus;
use App\Exceptions\TerminalControlRefused;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\TerminalGrant;
use App\Models\Projects\Host;
use Tests\Support\CommitsHookRows;
use Tests\Support\InspectOnlyAuthorizer;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\Terminals\TakesTerminalControl;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A viewer takes control of a terminal: two takes racing for one runtime leave one grant, an actor who may only inspect
 * is refused, and a host that does not carry out browser input stays watch-only.
 */
#[TimeLimit(seconds: 3, reason: 'It commits real rows on the hook database and empties its tables around each test.')]
final class TakeTerminalControlTest extends TestCase
{
    use CommitsHookRows;
    use OpensTerminalRuntimes;
    use TakesTerminalControl;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'terminal_views',
        'terminal_grants',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
    }

    public function test_two_takes_racing_for_one_runtime_leave_one_grant(): void
    {
        $runtime = $this->controllableRuntime();
        $interest = $this->openInterest($runtime);

        $first = $this->take($runtime, $interest);

        $this->assertRefusedWith(TerminalControlRefusal::ControlHeld, fn () => $this->take($runtime, $interest));
        $this->assertSame(TerminalGrantStatus::Taking, $first->state);
        $this->assertSame(1, TerminalGrant::query()->acrossActors()->count());
        $this->assertSame(
            [DriverOperation::TakeControl],
            DriverRequest::query()->pluck('operation')->all(),
        );
    }

    public function test_an_actor_who_may_only_inspect_is_refused_control(): void
    {
        $runtime = $this->controllableRuntime();
        $interest = $this->openInterest($runtime);
        $this->app->instance(CurrentAuthorizer::class, new InspectOnlyAuthorizer());

        $this->assertRefusedWith(TerminalControlRefusal::InspectOnly, fn () => $this->take($runtime, $interest));
        $this->assertSame(0, TerminalGrant::query()->acrossActors()->count());
    }

    public function test_a_host_that_does_not_carry_out_browser_input_is_watch_only(): void
    {
        $runtime = $this->runtimeOn($this->journal->enrolledHost()->hostId);
        $interest = $this->openInterest($runtime);

        $this->assertRefusedWith(TerminalControlRefusal::WatchOnly, fn () => $this->take($runtime, $interest));
    }

    /**
     * @param  callable(): mixed  $attempt
     */
    private function assertRefusedWith(TerminalControlRefusal $expected, callable $attempt): void
    {
        try {
            $attempt();
            $this->fail('The control was not refused.');
        } catch (TerminalControlRefused $refusal) {
            $this->assertSame($expected, $refusal->refusal);
        }
    }
}
