<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Agents\Commands\DeliverAgent\DeliverAgentCommand;
use App\Agents\Commands\WakeAgent\WakeAgentCommand;
use App\Agents\Drivers\Commands\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Agents\Drivers\Commands\ResolveDriverDelivery\ResolveDriverDeliveryCommand;
use App\Agents\Drivers\Commands\RetryDriverRequest\RetryDriverRequestCommand;
use App\Agents\Drivers\Enums\RequestProgress;
use App\Exceptions\DriverRequestRefused;
use App\Models\Drivers\DriverRequest;
use App\Sessions\OpenedRuntime;
use App\Values\DriverReceipt;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * An uncertain delivery is resolved, not retried, and a wake has no delivery to resolve.
 */
#[TestsCommand(ResolveDriverDeliveryCommand::class)]
final class ResolveDriverDeliveryTest extends TestCase
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

    public function test_an_uncertain_delivery_is_resolved_not_retried(): void
    {
        [$host, $opened] = $this->openRuntime();
        $receipt = $this->deliver($opened, 'uncertain', 'Hello');
        $this->journal->claimRequestsOnHost($host->hostId, 10);
        $request = DriverRequest::query()->findOrFail($receipt->requestId);
        $this->journal->asSystem(new NotifyRequestProgressCommand(
            $host->hostId,
            $request->id,
            $request->attempt_version,
            RequestProgress::DeliveryUncertain,
            null,
            null,
        ));
        $request->refresh();

        $this->assertThrows(
            fn () => $this->asOwner(new RetryDriverRequestCommand($request->id, $request->row_version, 'again')),
            DriverRequestRefused::class,
        );
        $this->asOwner(new ResolveDriverDeliveryCommand($request->id, $request->row_version, false, 'never arrived'));

        $this->assertSame(RequestProgress::Unavailable, $request->fresh()?->progress);
    }

    public function test_a_wake_has_no_delivery_to_resolve(): void
    {
        [, $opened] = $this->openRuntime();
        $wake = $this->asOwner(new WakeAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'wake-1'));
        $request = DriverRequest::query()->findOrFail($wake->requestId);

        $this->expectException(DriverRequestRefused::class);

        $this->asOwner(new ResolveDriverDeliveryCommand($request->id, $request->row_version, true, 'it woke'));
    }

    private function deliver(OpenedRuntime $opened, string $key, string $message): DriverReceipt
    {
        return $this->asOwner(DeliverAgentCommand::text($this->agentIdOf($opened), $opened->sessionId, $key, $message));
    }
}
