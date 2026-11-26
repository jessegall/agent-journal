<?php

declare(strict_types=1);

namespace Tests\Commands\Drivers;

use App\Agents\Commands\ChangeAgentEffort\ChangeAgentEffortCommand;
use App\Agents\Commands\ChangeAgentModel\ChangeAgentModelCommand;
use App\Agents\Commands\DeliverAgent\DeliverAgentCommand;
use App\Agents\Drivers\Commands\CancelDriverRequest\CancelDriverRequestCommand;
use App\Agents\Drivers\Enums\RecoveryAction;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Events\Sessions\DriverRequestRecovered;
use App\Exceptions\DriverRequestRefused;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Sessions\OpenedRuntime;
use App\Values\DriverReceipt;
use Illuminate\Support\Facades\Event;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * Cancelling a setting request puts the requested settings back and is recorded; a request changed since it was read
 * is refused.
 */
#[TestsCommand(CancelDriverRequestCommand::class)]
final class CancelDriverRequestTest extends TestCase
{
    use CommitsHookRows;
    use OpensLedgerRuntimes;

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
        'accounts',
        'active_accounts',
        'session_processes',
        'links',
    ];

    public function test_cancelling_a_setting_puts_the_requested_settings_back_and_is_recorded(): void
    {
        Event::fake([DriverRequestRecovered::class]);
        [, $opened] = $this->openRuntime();
        $agentId = $this->agentIdOf($opened);
        $this->asOwner(new ChangeAgentModelCommand($agentId, $opened->sessionId, 'model-1', 'claude-sonnet-5-5'));
        $effort = $this->asOwner(new ChangeAgentEffortCommand($agentId, $opened->sessionId, 'effort-1', 'high'));
        $request = DriverRequest::query()->findOrFail($effort->requestId);

        $this->asOwner(new CancelDriverRequestCommand($request->id, $request->row_version, 'not needed after all'));

        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);
        $this->assertSame(RequestProgress::Cancelled, $request->fresh()?->progress);
        $this->assertSame(['claude-sonnet-5-5', null], [$runtime->requested_model, $runtime->requested_effort]);
        Event::assertDispatched(
            DriverRequestRecovered::class,
            fn (DriverRequestRecovered $event) => $event->requestId === $request->id
                && $event->action === RecoveryAction::Cancelled
                && $event->reason === 'not needed after all',
        );
    }

    public function test_a_request_changed_since_it_was_read_is_refused(): void
    {
        [, $opened] = $this->openRuntime();
        $receipt = $this->deliver($opened, 'stale', 'Hello');
        $request = DriverRequest::query()->findOrFail($receipt->requestId);

        $this->expectException(DriverRequestRefused::class);

        $this->asOwner(new CancelDriverRequestCommand($request->id, $request->row_version + 1, 'too late'));
    }

    private function deliver(OpenedRuntime $opened, string $key, string $message): DriverReceipt
    {
        return $this->asOwner(DeliverAgentCommand::text($this->agentIdOf($opened), $opened->sessionId, $key, $message));
    }
}
