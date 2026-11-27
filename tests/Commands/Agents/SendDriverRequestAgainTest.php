<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Agents\Commands\DeliverAgent\DeliverAgentCommand;
use App\Agents\Drivers\Commands\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Agents\Drivers\Commands\RetryDriverRequest\RetryDriverRequestCommand;
use App\Agents\Drivers\Commands\SendDriverRequestAgain\SendDriverRequestAgainCommand;
use App\Agents\Drivers\Enums\HostWakeRefusal;
use App\Agents\Drivers\Enums\RequestOutcome;
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
 * An uncertain delivery is sent again only once it is confirmed as a possible duplicate.
 */
#[TestsCommand(SendDriverRequestAgainCommand::class)]
final class SendDriverRequestAgainTest extends TestCase
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

    public function test_an_uncertain_delivery_is_sent_again_only_as_a_confirmed_possible_duplicate(): void
    {
        [$host, $opened] = $this->openRuntime();
        $receipt = $this->deliver($opened, 'uncertain', 'Hello');
        $this->journal->claimRequestsOnHost($host->hostId, 10);
        $this->notifyProgress($host->hostId, $receipt->requestId, RequestProgress::DeliveryUncertain);
        $original = DriverRequest::query()->findOrFail($receipt->requestId);

        $this->assertThrows(
            fn () => $this->asOwner(new RetryDriverRequestCommand($original->id, $original->row_version, 'retry')),
            DriverRequestRefused::class,
        );
        $this->assertThrows(
            fn () => $this->asOwner(new SendDriverRequestAgainCommand($original->id, false, 'again')),
            DriverRequestRefused::class,
            DriverRequestRefused::duplicateNotConfirmed($original->id)->getMessage(),
        );

        $againId = $this->asOwner(new SendDriverRequestAgainCommand($original->id, true, 'again'));
        $repeated = $this->asOwner(new SendDriverRequestAgainCommand($original->id, true, 'again'));

        $again = DriverRequest::query()->findOrFail($againId);
        $this->assertSame([$againId, $original->id], [$repeated, $again->possible_duplicate_of_id]);
        $this->assertEquals($original->partList(), $again->partList());
        $this->assertSame(RequestProgress::DeliveryUncertain, $original->fresh()?->progress);
    }

    private function deliver(OpenedRuntime $opened, string $key, string $message): DriverReceipt
    {
        return $this->asOwner(DeliverAgentCommand::text($this->agentIdOf($opened), $opened->sessionId, $key, $message));
    }

    private function notifyProgress(string $hostId, string $requestId, RequestProgress $progress): void
    {
        $request = DriverRequest::query()->findOrFail($requestId);

        $this->journal->asSystem(new NotifyRequestProgressCommand(
            $hostId,
            $request->id,
            $request->attempt_version,
            $progress,
            null,
            RequestOutcome::EntryUnavailable,
            refusal: HostWakeRefusal::ContainerUnavailable,
            hasCreatedNoProcess: true,
        ));
    }
}
