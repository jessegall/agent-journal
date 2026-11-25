<?php

declare(strict_types=1);

namespace Tests\Commands\Drivers;

use App\Commands\Agents\DeliverAgent\DeliverAgentCommand;
use App\Commands\Drivers\ClaimDriverRequests\ClaimDriverRequestsCommand;
use App\Commands\Drivers\NotifyRequestProgress\NotifyRequestProgressCommand;
use App\Commands\Drivers\RetryDriverRequest\RetryDriverRequestCommand;
use App\Commands\Drivers\SendDriverRequestAgain\SendDriverRequestAgainCommand;
use App\Enums\Drivers\HostWakeRefusal;
use App\Enums\Drivers\RequestOutcome;
use App\Enums\Drivers\RequestProgress;
use App\Exceptions\DriverRequestRefused;
use App\Models\Drivers\DriverRequest;
use App\Support\OpenedRuntime;
use App\Values\BrowserInputCapabilities;
use App\Values\DriverReceipt;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * An uncertain delivery is sent again only once it is confirmed as a possible duplicate.
 */
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
        $this->journal->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
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
