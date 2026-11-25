<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Commands\Agents\DeliverAgent\DeliverAgentCommand;
use App\Contracts\Drivers\AttachmentReferences;
use App\Contracts\Drivers\MessagePart;
use App\Data\Messages\MessageAttachmentData;
use App\Data\Messages\MessageTextData;
use App\Exceptions\DriverRequestRefused;
use App\Models\Agents\Agent;
use App\Models\Drivers\DriverRequest;
use App\Models\Projects\Host;
use App\Support\DriverBudgets;
use App\Support\EnrolledHost;
use App\Support\OpenedRuntime;
use App\Values\DriverReceipt;
use Illuminate\Support\Str;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\OpensPairChats;
use Tests\Support\WritesInboxMessages;
use Tests\TestCase;

/**
 * A message is delivered to an agent's runtime: a repeated key returns the same request while other content conflicts,
 * attachments reach the host as their parts in order and one that cannot be read refuses the whole delivery, requests
 * are numbered in the order they were accepted, an applied request keeps the driver's whole session id, and a message
 * over the limit is refused before it is accepted.
 */
final class DeliverAgentTest extends TestCase
{
    use CommitsHookRows;
    use OpensLedgerRuntimes;
    use OpensPairChats;
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

    public function test_a_repeated_key_returns_the_same_request_and_other_content_conflicts(): void
    {
        [, $opened] = $this->openRuntime();

        $first = $this->deliver($opened, 'key-1', 'Hello');
        $again = $this->deliver($opened, 'key-1', 'Hello');

        $this->assertSame($first->requestId, $again->requestId);
        $this->expectException(DriverRequestRefused::class);
        $this->deliver($opened, 'key-1', 'Something else');
    }

    public function test_an_attachment_only_delivery_reaches_the_host_as_its_parts_in_order(): void
    {
        $this->app->scoped(
            AttachmentReferences::class,
            fn (): AttachmentReferences => $this->attachmentsExcept('gone'),
        );
        [$host, $opened] = $this->openRuntime();
        $parts = [new MessageAttachmentData('01JNOTES', 'digest-1', 'notes.md'), new MessageTextData('Read it first.')];

        $receipt = $this->asOwner(
            new DeliverAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'parts', $parts),
        );

        $claimed = $this->claimedScript($host, $receipt->requestId);
        $this->assertSame(array_map(fn (MessagePart $part): array => $part->toArray(), $parts), $claimed['parts']);
    }

    public function test_a_delivery_naming_an_attachment_that_cannot_be_read_is_refused_whole(): void
    {
        $this->app->scoped(
            AttachmentReferences::class,
            fn (): AttachmentReferences => $this->attachmentsExcept('gone'),
        );
        [, $opened] = $this->openRuntime();
        $parts = [new MessageTextData('Here it is.'), new MessageAttachmentData('gone', 'digest-1', 'old.md')];

        $this->assertThrows(
            fn () => $this->asOwner(
                new DeliverAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'mixed', $parts),
            ),
            DriverRequestRefused::class,
            DriverRequestRefused::attachmentMissing('gone')->getMessage(),
        );
        $this->assertSame(0, DriverRequest::query()->where('idempotency_key', 'mixed')->count());
    }

    public function test_a_repeated_delivery_of_the_same_parts_returns_the_same_request(): void
    {
        $this->app->scoped(
            AttachmentReferences::class,
            fn (): AttachmentReferences => $this->attachmentsExcept('gone'),
        );
        [, $opened] = $this->openRuntime();
        $parts = [new MessageAttachmentData('01JNOTES', 'digest-1', 'notes.md')];
        $send = fn (): DriverReceipt => $this->asOwner(
            new DeliverAgentCommand($this->agentIdOf($opened), $opened->sessionId, 'same', $parts),
        );

        $this->assertSame($send()->requestId, $send()->requestId);
    }

    public function test_requests_are_numbered_in_the_order_they_were_accepted(): void
    {
        [, $opened] = $this->openRuntime();

        $first = $this->deliver($opened, 'a', 'First');
        $second = $this->deliver($opened, 'b', 'Second');

        $this->assertSame($first->sequence + 1, $second->sequence);
    }

    public function test_an_applied_request_keeps_the_drivers_whole_session_id(): void
    {
        [, $opened] = $this->openRuntime();
        $request = DriverRequest::query()->findOrFail($this->deliver($opened, 'key-1', 'Hello')->requestId);
        $sessionId = (string) Str::uuid();

        $request->markApplied($sessionId);

        $this->assertSame($sessionId, $request->refresh()->actual_binding);
    }

    public function test_a_message_over_the_delivery_limit_is_refused_before_it_is_accepted(): void
    {
        config(['agents.driver_budgets.deliver_max_bytes' => 10]);
        $this->app->forgetInstance(DriverBudgets::class);
        [, $opened] = $this->openRuntime();

        $this->assertThrows(fn () => $this->deliver($opened, 'too-long', 'Eleven byte'), DriverRequestRefused::class);
        $this->assertSame(0, DriverRequest::query()->where('idempotency_key', 'too-long')->count());
    }

    /**
     * The request as the host's claim hands it out.
     *
     * @return array<string, mixed>
     */
    private function claimedScript(EnrolledHost $host, string $requestId): array
    {
        $requests = $this->journal->hostCall(
            $host,
            'POST',
            '/host/claim?limit=10&wait=0&watched_version=0',
        )->assertOk()->json('requests');

        return collect($requests)->firstOrFail(fn (array $claimed) => $claimed['requestId'] === $requestId);
    }

    /**
     * Attachments that can all be read but the one named.
     */
    private function attachmentsExcept(string $missing): AttachmentReferences
    {
        return new readonly class($missing) implements AttachmentReferences
        {
            public function __construct(private string $missing) {}

            public function assertReadable(MessageAttachmentData $part, string $recipientSessionId): void
            {
                if ($part->attachmentId === $this->missing) {
                    throw DriverRequestRefused::attachmentMissing($part->attachmentId);
                }
            }
        };
    }

    private function deliver(OpenedRuntime $opened, string $key, string $message): DriverReceipt
    {
        return $this->asOwner(DeliverAgentCommand::text($this->agentIdOf($opened), $opened->sessionId, $key, $message));
    }
}
