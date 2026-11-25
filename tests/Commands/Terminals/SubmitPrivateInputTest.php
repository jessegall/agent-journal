<?php

declare(strict_types=1);

namespace Tests\Commands\Terminals;

use App\Commands\Terminals\OpenPrivateEntry\OpenPrivateEntryCommand;
use App\Commands\Terminals\OpenTerminalView\OpenTerminalViewCommand;
use App\Commands\Terminals\SubmitPrivateInput\SubmitPrivateInputCommand;
use App\Commands\Terminals\TakeTerminalControl\TakeTerminalControlCommand;
use App\Data\Terminals\TerminalControlData;
use App\Enums\Drivers\DriverOperation;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\TerminalGrant;
use App\Models\Projects\Host;
use App\Support\PrivateValues;
use App\Values\BrowserInputCapabilities;
use App\Values\PrivateSubmission;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\OpensTerminalRuntimes;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A private value typed into an open private entry reaches the host once and is stored nowhere.
 */
#[TimeLimit(seconds: 3, reason: 'It commits real rows on the hook database and empties its tables around each test.')]
final class SubmitPrivateInputTest extends TestCase
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
}
