<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Commands\Terminals\OpenPrivateEntry\OpenPrivateEntryCommand;
use App\Commands\Terminals\OpenTerminalView\OpenTerminalViewCommand;
use App\Commands\Terminals\SendTerminalInput\SendTerminalInputCommand;
use App\Commands\Terminals\SubmitPrivateInput\SubmitPrivateInputCommand;
use App\Commands\Terminals\TakeTerminalControl\TakeTerminalControlCommand;
use App\Contracts\Authorization\CurrentAuthorizer;
use App\Contracts\Navigation\TerminalViewCloser;
use App\Data\Terminals\TerminalControlData;
use App\Enums\Drivers\DriverOperation;
use App\Enums\Terminals\TerminalControlRefusal;
use App\Enums\Terminals\TerminalGrantStatus;
use App\Enums\Terminals\TerminalInputType;
use App\Enums\Terminals\TerminalNamedKey;
use App\Exceptions\TerminalControlRefused;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\TerminalGrant;
use App\Models\Projects\Host;
use App\Support\PrivateValues;
use App\Support\TerminalInput;
use App\Values\BrowserInputCapabilities;
use App\Values\PrivateSubmission;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\InspectOnlyAuthorizer;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A browser writer's control of an agent's terminal at the server: one take wins a race, an actor who may only
 * inspect is refused, a revoked grant's input never reaches the host, a host that does not carry out browser input
 * is watch-only, and every operation becomes a control request whose typed text the report clears.
 */
#[TimeLimit(seconds: 3, reason: 'It commits real rows on the hook database and empties its tables around each test.')]
final class TerminalControlTest extends TestCase
{
    use CommitsHookRows;
    use OpensTerminalRuntimes;
    use RunsTrustedCommands;
    use SendsHostCalls;

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

    public function test_a_revoked_grant_has_its_input_refused_at_the_server(): void
    {
        $runtime = $this->controllableRuntime();
        $interest = $this->openInterest($runtime);
        $this->take($runtime, $interest);
        TerminalGrant::query()->acrossActors()->sole()->issue('grant-1');

        $this->app->make(TerminalViewCloser::class)
            ->closeAllFor($runtime->session->agent_id, $this->owner(), CarbonImmutable::now());

        $this->assertSame(TerminalGrantStatus::Retired, TerminalGrant::query()->acrossActors()->sole()->status);
        $this->assertRefusedWith(TerminalControlRefusal::GrantEnded, fn () => $this->asOwner(new SendTerminalInputCommand(
            $runtime->session->agent_id,
            'grant-1',
            new TerminalInput('ls', true, 1, 0),
        )));
        $this->assertSame(0, DriverRequest::query()->where('operation', DriverOperation::TerminalInput)->count());
    }

    public function test_a_host_that_does_not_carry_out_browser_input_is_watch_only(): void
    {
        $runtime = $this->runtimeOn($this->enrolledHost()->hostId);
        $interest = $this->openInterest($runtime);

        $this->assertRefusedWith(TerminalControlRefusal::WatchOnly, fn () => $this->take($runtime, $interest));
    }

    public function test_input_goes_to_the_host_at_the_next_sequence_and_a_gap_names_the_expected_one(): void
    {
        $runtime = $this->controllableRuntime();
        $this->take($runtime, $this->openInterest($runtime));
        TerminalGrant::query()->acrossActors()->sole()->issue('grant-1');
        $agentId = $runtime->session->agent_id;

        $sent = $this->asOwner(new SendTerminalInputCommand($agentId, 'grant-1', new TerminalInput('ls', true, 1, 0)));

        $this->assertSame(2, $sent->nextSequence);
        $this->assertSame(1, DriverRequest::query()->where('operation', DriverOperation::TerminalInput)->count());

        try {
            $this->asOwner(new SendTerminalInputCommand($agentId, 'grant-1', new TerminalInput('pwd', true, 5, 0)));
            $this->fail('An input out of order was sent.');
        } catch (TerminalControlRefused $refusal) {
            $this->assertSame(TerminalControlRefused::sequenceGap(2)->getMessage(), $refusal->getMessage());
        }
    }

    public function test_a_paste_over_its_bound_is_refused_with_the_limit_before_anything_is_sent(): void
    {
        $runtime = $this->controllableRuntime();
        $this->take($runtime, $this->openInterest($runtime));
        TerminalGrant::query()->acrossActors()->sole()->issue('grant-1');
        $paste = new TerminalInput(str_repeat('x', 17 * 1024), false, 1, 0, TerminalInputType::Paste);

        try {
            $this->asOwner(new SendTerminalInputCommand($runtime->session->agent_id, 'grant-1', $paste));
            $this->fail('The large paste was sent.');
        } catch (TerminalControlRefused $refusal) {
            $this->assertSame(TerminalControlRefusal::PasteTooLarge, $refusal->refusal);
            $this->assertSame(TerminalControlRefused::pasteTooLarge(16_384)->getMessage(), $refusal->getMessage());
        }

        $this->assertSame(0, DriverRequest::query()->where('operation', DriverOperation::TerminalInput)->count());
    }

    public function test_a_named_key_goes_to_the_host_by_its_name(): void
    {
        $runtime = $this->controllableRuntime();
        $this->take($runtime, $this->openInterest($runtime));
        TerminalGrant::query()->acrossActors()->sole()->issue('grant-1');
        $key = new TerminalInput('', false, 1, 0, TerminalInputType::Key, TerminalNamedKey::CtrlC);

        $this->asOwner(new SendTerminalInputCommand($runtime->session->agent_id, 'grant-1', $key));

        $sent = DriverRequest::query()->where('operation', DriverOperation::TerminalInput)->sole();
        $this->assertStringContainsString('"key":"ctrl_c"', (string) $sent->message);
    }

    public function test_a_private_value_reaches_the_host_once_and_is_stored_nowhere(): void
    {
        $runtime = $this->controllableRuntime();
        $this->take($runtime, $this->openInterest($runtime));
        TerminalGrant::query()->acrossActors()->sole()->issue('grant-1');
        $agentId = $runtime->session->agent_id;
        $values = $this->app->make(PrivateValues::class);
        $secret = 'correct-horse-'.Str::random(12);

        $this->asOwner(new OpenPrivateEntryCommand($agentId, 'grant-1', 1));
        $values->keep('private-1', $secret);
        $this->asOwner(new SubmitPrivateInputCommand($agentId, 'grant-1', new PrivateSubmission('private-1', 2)));

        $request = DriverRequest::query()->where('operation', DriverOperation::PrivateInput)->sole();
        $this->assertStringNotContainsString($secret, (string) $request->message);
        $claimed = $values->carriedBy($request, $request->claimed($runtime, null, false));
        $again = $values->carriedBy($request, $request->claimed($runtime, null, false));
        $this->assertStringContainsString($secret, (string) $claimed->message);
        $this->assertStringNotContainsString($secret, (string) $again->message);
        $this->assertSame(0, DriverRequest::query()->where('message', 'like', '%'.$secret.'%')->count());
    }

    private function controllableRuntime(): AgentRuntime
    {
        $host = $this->enrolledHost();
        $everyInput = new BrowserInputCapabilities(true, true, true, true, true);
        Host::query()->whereKey($host->hostId)->sole()->advertiseBrowserInput($everyInput);

        return $this->runtimeOn($host->hostId);
    }

    private function openInterest(AgentRuntime $runtime): string
    {
        return $this->asOwner(new OpenTerminalViewCommand($runtime->session->agent_id, (string) Str::ulid()))->readInterestId;
    }

    private function take(AgentRuntime $runtime, string $interest): TerminalControlData
    {
        return $this->asOwner(new TakeTerminalControlCommand($runtime->session->agent_id, $interest, (string) Str::ulid()));
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
