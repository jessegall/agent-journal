<?php

declare(strict_types=1);

namespace Tests\Commands\Terminals;

use App\Commands\Terminals\OpenTerminalView\OpenTerminalViewCommand;
use App\Commands\Terminals\SendTerminalInput\SendTerminalInputCommand;
use App\Commands\Terminals\TakeTerminalControl\TakeTerminalControlCommand;
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
use App\Support\TerminalInput;
use App\Values\BrowserInputCapabilities;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The holder of control sends input, which goes to the host at the next sequence; a gap names the expected sequence, a
 * paste over its bound is refused before anything is sent, a named key goes by its name and a revoked grant is
 * refused at the server.
 */
#[TimeLimit(seconds: 3, reason: 'It commits real rows on the hook database and empties its tables around each test.')]
final class SendTerminalInputTest extends TestCase
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
