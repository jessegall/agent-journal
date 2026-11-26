<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Routes;

use App\Commands\Drivers\NotifyDriverTurn\NotifyDriverTurnCommand;
use App\Commands\Messages\SendMessage\SendMessageCommand;
use Domain\Chat\ChatDomain;
use Illuminate\Support\Str;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Entries\GuardedRouteEntryTestCase;
use Tests\Support\Entries\RouteCall;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\WithActiveAccount;

/**
 * The chat page sends a message to one of the user's chats, with the payload the page records.
 */
#[TestsRoute('POST', 'chat.send')]
final class SendPostTest extends GuardedRouteEntryTestCase
{
    use WithActiveAccount;

    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    public function test_a_message_reaches_its_session_after_a_new_turn_started_another_process(): void
    {
        $this->chooseActiveAccounts();
        $inbox = $this->journal->owner()->inboxCalled('Owner');
        $this->journal->idleAgent('Turning agent')->enrollHost('Turn host', ['/work']);
        $opened = $this->journal->openRuntimeOn('Turning agent', 'Turn host', '/work');

        $this->journal->asSystem(new NotifyDriverTurnCommand(
            $this->journal->hostCalled('Turn host')->hostId,
            $opened->runtimeId,
            2,
            'prompt-2',
            false,
            null,
            null,
            null,
        ));

        $call = RouteCall::recorded('chat-send', ['01JPAGEREQUESTINBOX0000000' => $inbox->id])
            ->payload([
                'body' => 'Hello',
                'agent' => $this->journal->agentCalled('Turning agent')->id,
                'expectedSessionId' => $opened->sessionId,
                'inboxId' => $inbox->id,
            ]);

        $this->send($call, $call->caller)->assertRedirect();

        $this->journal->assertMessageSent($inbox, 'Owner', 'Hello');
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $inbox = $journal->owner()->inboxCalled('Owner');

        return RouteCall::recorded('chat-send', ['01JPAGEREQUESTINBOX0000000' => $inbox->id])
            ->reply(SendMessageCommand::class, Str::ulid())
            ->expects(SendMessageCommand::class, [
                'inboxId' => $inbox->id,
                'body' => 'Hello',
            ]);
    }
}
