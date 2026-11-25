<?php

declare(strict_types=1);

namespace Tests\Commands\Drivers;

use App\Commands\Agents\ChangeAgentEffort\ChangeAgentEffortCommand;
use App\Commands\Agents\ChangeAgentModel\ChangeAgentModelCommand;
use App\Commands\Agents\DeliverAgent\DeliverAgentCommand;
use App\Commands\Drivers\CancelDriverRequest\CancelDriverRequestCommand;
use App\Enums\Drivers\RecoveryAction;
use App\Enums\Drivers\RequestProgress;
use App\Events\Sessions\DriverRequestRecovered;
use App\Exceptions\DriverRequestRefused;
use App\Models\Accounts\Account;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Models\Projects\Host;
use App\Support\OpenedRuntime;
use App\Values\DriverReceipt;
use Illuminate\Support\Facades\Event;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\OpensPairChats;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\WritesInboxMessages;
use Tests\TestCase;

/**
 * Cancelling a setting request puts the requested settings back and is recorded; a request changed since it was read
 * is refused.
 */
final class CancelDriverRequestTest extends TestCase
{
    use CommitsHookRows;
    use OpensLedgerRuntimes;
    use OpensPairChats;
    use RunsTrustedCommands;
    use SendsHostCalls;
    use WritesInboxMessages;

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

    /**
     * A setting change the host staged waits for a turn and counts as applied only on that turn's evidence: the model
     * its output names confirms a model change, while an effort change, which no output shows, stays unconfirmed.
     */
    /**
     * A host that could not start a turn, such as a prompt its screen did not let in, reports it staged and tries no
     * more: the journal takes the request back and offers it again once its wait has passed.
     */
    /**
     * The host reports a turn's end as it saw it; the journal judges a result marked an error as a failed turn.
     */
    /**
     * A turn that runs past the journal's limit is interrupted on the next engine pass, once, and its runtime held.
     */
    /**
     * The host reports plain facts and the journal chooses the hold: an account that is not signed in, and a stop the
     * host could not prove, each leave the runtime needing attention.
     */
    /**
     * The journal's hold is the only one: an interrupted runtime is offered no new work until a user releases it, and
     * then it is.
     */
    /**
     * A host keeps the runtime of every session it ever ran, so a claim reads only those with a request waiting, and
     * more than a page of their requests when they hold that many.
     */
    /**
     * An idle runtime reports nothing between two turns, so its last report grew stale after a
     * minute and its session read as Status unknown though nothing was wrong.
     */
    /**
     * A page learns that a session's state changed from the host's report itself, so its header
     * never waits for a reload; a beat that only keeps a fresh report fresh says nothing.
     */
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
