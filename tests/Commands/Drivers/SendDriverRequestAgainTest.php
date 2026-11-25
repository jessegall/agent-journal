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
use App\Models\Accounts\Account;
use App\Models\Drivers\DriverRequest;
use App\Models\Projects\Host;
use App\Support\OpenedRuntime;
use App\Values\BrowserInputCapabilities;
use App\Values\DriverReceipt;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\OpensPairChats;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\WritesInboxMessages;
use Tests\TestCase;

/**
 * An uncertain delivery is sent again only once it is confirmed as a possible duplicate.
 */
final class SendDriverRequestAgainTest extends TestCase
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
    public function test_an_uncertain_delivery_is_sent_again_only_as_a_confirmed_possible_duplicate(): void
    {
        [$host, $opened] = $this->openRuntime();
        $receipt = $this->deliver($opened, 'uncertain', 'Hello');
        $this->asSystem(new ClaimDriverRequestsCommand($host->hostId, 10, BrowserInputCapabilities::none()));
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

        $this->asSystem(new NotifyRequestProgressCommand(
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
