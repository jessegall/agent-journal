<?php

declare(strict_types=1);

namespace Tests\Machinery\Listeners;

use App\Agents\Drivers\Enums\DriverOperation;
use App\Listeners\WakeAgentsForMessage;
use App\Messages\Commands\SendMessage\SendMessageCommand;
use App\Models\Drivers\DriverRequest;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\TestCase;

/**
 * A message sent into an inbox wakes every agent attached to it but the sender, so an idle agent reads it; the sender
 * is not woken by its own message.
 */
#[TestsMachinery(WakeAgentsForMessage::class)]
final class WakeAgentsForMessageTest extends TestCase
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
        'accounts',
        'active_accounts',
        'session_processes',
        'links',
        'inboxes',
        'inbox_members',
        'messages',
    ];

    public function test_a_message_to_an_agents_inbox_asks_its_runtime_to_wake(): void
    {
        [, $opened] = $this->openRuntime();
        $this->journal->sharedInbox('Owner', 'Driven agent 1');
        $before = $this->wakesAsked();

        $this->journal->asOwner(new SendMessageCommand($this->journal->sharedInboxOf('Owner', 'Driven agent 1')->id, 'Ready?'));

        $this->journal->assertResult([true, $opened->sessionId], [$this->wakesAsked() > $before, $opened->sessionId]);
    }

    private function wakesAsked(): int
    {
        return (int) DriverRequest::query()->where('operation', DriverOperation::Wake)->sum('wake_requested');
    }
}
