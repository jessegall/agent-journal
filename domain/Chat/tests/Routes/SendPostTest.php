<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Routes;

use App\Messages\Commands\SendMessage\SendMessageCommand;
use App\Models\Agents\AgentSession;
use Domain\Chat\ChatDomain;
use Domain\Chat\Tests\Fixtures\ChatFixtures;
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

    public function test_a_message_reaches_its_running_session(): void
    {
        $this->chooseActiveAccounts();
        $inbox = $this->journal->owner()->inboxCalled('Owner');
        $this->journal->showDriverArrangements()->idleAgent('Turning agent')->enrollHost('Turn host', ['/work']);

        $this->journal->withAgent('Turning agent', fn (TestAgent $turningAgent) => $turningAgent
            ->openRuntime('Turn host', '/work'));

        $opened = $this->journal->openedRuntimeOf('Turning agent');

        $running = AgentSession::query()->where('agent_id', $this->journal->agentCalled('Turning agent')->id)
            ->running()->pluck('id')->all();

        $this->assertSame([$opened->sessionId], $running);

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

    public function test_a_message_for_a_session_the_agent_no_longer_runs_is_refused_and_nothing_is_sent(): void
    {
        $session = $this->journal->owner()->idleAgent('Chat builder')
            ->startSession('Chat builder', 'Chat builder')
            ->sessionCalled('Chat builder');

        $inbox = $this->journal->fixtures(ChatFixtures::class)->pairChatBetween('Owner', 'Chat builder')
            ->pairChatOf('Owner', 'Chat builder');

        $this->journal->sinkCommands();

        $this->journal->route('POST', 'chat.send', payload: [
            'inboxId' => $inbox->id,
            'requestKey' => 'home-send-1',
            'body' => 'Still there?',
            'agent' => $session->agent_id,
            'expectedSessionId' => strtolower((string) Str::ulid()),
            'expectedGeneration' => 0,
        ])->assertSessionHasErrors(['session' => 'The agent now runs another session. Send the message again to reach it.']);

        $this->journal->assertNothingDispatched();
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $inbox = $journal->owner()->inboxCalled('Owner');

        return RouteCall::recorded('chat-send', ['01JPAGEREQUESTINBOX0000000' => $inbox->id])
            ->reply(SendMessageCommand::class, Str::ulid())
            ->expects(SendMessageCommand::class, ['inboxId' => $inbox->id, 'body' => 'Hello']);
    }
}
