<?php

declare(strict_types=1);

namespace Tests\Commands\Drivers;

use App\Commands\Agents\DeliverAgent\DeliverAgentCommand;
use App\Commands\Agents\InterruptAgent\InterruptAgentCommand;
use App\Commands\Agents\OpenAgentRuntime\OpenAgentRuntimeCommand;
use App\Commands\Agents\StopAgent\StopAgentCommand;
use App\Commands\Drivers\ClaimDriverRequests\ClaimDriverRequestsCommand;
use App\Enums\Drivers\DriverOperation;
use App\Enums\Drivers\DriverType;
use App\Enums\Drivers\RequestProgress;
use App\Models\Drivers\DriverRequest;
use App\Models\Projects\Host;
use App\Support\ClaimedRequests;
use App\Support\DefaultDrivers;
use App\Support\OpenedRuntime;
use App\Values\BrowserInputCapabilities;
use App\Values\DriverReceipt;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A host claims the waiting requests of its own runtimes only, a batch at a time even with more runtimes than a batch,
 * and a stop or an interrupt is claimed past a full batch of normal work.
 */
#[TestsCommand(ClaimDriverRequestsCommand::class)]
final class ClaimDriverRequestsTest extends TestCase
{
    private const int RUNTIMES_PAST_A_BATCH = 10;

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

    private const string FOLDER = '/work/project';

    public function test_a_host_claims_only_the_requests_of_its_own_runtimes(): void
    {
        [$host, $opened] = $this->openHostClaimedRuntime(firstMessage: 'Mine');
        [, $foreign] = $this->openHostClaimedRuntime(firstMessage: 'Not mine');

        $claimed = $this->journal->asSystem(
            new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()),
        );

        $this->assertInstanceOf(ClaimedRequests::class, $claimed);
        $this->assertSame(
            [$opened->firstRequestId],
            array_map(fn ($request): string => $request->requestId, $claimed->requests),
        );
        $this->assertSame(
            RequestProgress::Staged,
            DriverRequest::query()->findOrFail($opened->firstRequestId)->progress,
        );
        $this->assertSame(
            RequestProgress::Accepted,
            DriverRequest::query()->findOrFail($foreign->firstRequestId)->progress,
        );
    }

    /**
     * A host keeps the runtime of every session it ever ran, so a claim reads only those with a request waiting, and
     * more than a page of their requests when they hold that many.
     */
    public function test_a_host_with_more_runtimes_than_a_batch_still_claims_a_batch(): void
    {
        [$host] = $this->openHostClaimedRuntime(firstMessage: 'First');

        for ($more = 0; $more < self::RUNTIMES_PAST_A_BATCH; $more++) {
            $this->asOwner(new OpenAgentRuntimeCommand(
                $this->agent()->id,
                $host->hostId,
                self::FOLDER,
                DefaultDrivers::CODEX,
                '2.1.323',
                'claude',
                DriverType::Headless,
                'claude-opus-5-5',
                firstMessage: 'Another',
            ));
        }

        $claimed = $this->journal->asSystem(
            new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()),
        );

        $this->assertCount(10, $claimed->requests);
    }

    public function test_a_stop_and_an_interrupt_are_claimed_past_a_full_batch_of_normal_work(): void
    {
        [$host, $opened] = $this->openHostClaimedRuntime();

        foreach (range(1, 12) as $number) {
            $this->deliver($opened, "work-{$number}", "Work {$number}");
        }

        $this->asOwner(new InterruptAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'interrupt-1'));
        $this->asOwner(new StopAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'stop-1'));

        $claimed = $this->journal->asSystem(
            new ClaimDriverRequestsCommand($host->hostId, 5, BrowserInputCapabilities::none()),
        );

        $operations = array_map(fn ($request) => $request->operation, $claimed->requests);
        $this->assertContains(DriverOperation::Interrupt->value, $operations);
        $this->assertContains(DriverOperation::Stop->value, $operations);
    }

    private function deliver(OpenedRuntime $opened, string $key, string $message): DriverReceipt
    {
        return $this->asOwner(DeliverAgentCommand::text($this->agentIdOf($opened), $opened->sessionId, $key, $message));
    }
}
