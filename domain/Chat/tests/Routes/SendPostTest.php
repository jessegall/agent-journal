<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Routes;

use App\Agents\Commands\StartProfileMain\StartProfileMainCommand;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\DriverSourceType;
use App\Agents\Enums\ConversationModeType;
use App\Agents\Values\SelectionSource;
use App\Messages\Commands\SendMessage\SendMessageCommand;
use App\Models\Agents\AgentSession;
use App\Sessions\StartReceipt;
use App\Values\ModelSelection;
use App\Values\ProfileKey;
use App\Values\SelectedDriver;
use Domain\Chat\ChatDomain;
use Domain\Chat\Tests\Fixtures\ChatFixtures;
use Illuminate\Support\Str;
use Tests\Support\Agents\TestAgent;
use Tests\Support\Bus\ExpectedCommand;
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
            'body' => 'Still there?',
            'agent' => $session->agent_id,
            'expectedSessionId' => strtolower((string) Str::ulid()),
            'expectedGeneration' => 0,
        ], headers: ['Idempotency-Key' => 'home-send-1'])->assertSessionHasErrors([
            'session' => 'The agent now runs another session. Send the message again to reach it.',
        ]);

        $this->journal->assertNothingDispatched();
    }

    public function test_a_message_to_an_agent_with_no_session_starts_it_first_under_the_message_request(): void
    {
        $agent = $this->journal->owner()->idleAgent('Chat builder')->agentCalled('Chat builder');
        $inbox = $this->journal->fixtures(ChatFixtures::class)->pairChatBetween('Owner', 'Chat builder')
            ->pairChatOf('Owner', 'Chat builder');
        $requestKey = strtolower((string) Str::ulid());

        $this->journal->sinkCommands()->sinkReplies([
            StartProfileMainCommand::class => self::receiptFor($requestKey, $agent->id),
            SendMessageCommand::class => strtolower((string) Str::ulid()),
        ]);

        $this->journal->route('POST', 'chat.send', payload: [
            'inboxId' => $inbox->id,
            'body' => 'Are you there?',
            'agent' => $agent->id,
            'expectedSessionId' => null,
        ], headers: ['Idempotency-Key' => $requestKey])->assertRedirect();

        $this->journal->assertDispatchedInOrder([
            ExpectedCommand::of(StartProfileMainCommand::class, [
                'requestId' => $requestKey,
                'agentId' => $agent->id,
                'profile' => ProfileKey::from($agent->profile_key),
                'requested' => ModelSelection::fromInput('default'),
                'conversationId' => null,
            ]),
            ExpectedCommand::of(SendMessageCommand::class, ['inboxId' => $inbox->id, 'body' => 'Are you there?']),
        ]);
    }

    public function test_a_message_to_an_agent_that_runs_a_session_starts_nothing(): void
    {
        $session = $this->journal->owner()->idleAgent('Chat builder')
            ->startSession('Chat builder', 'Chat builder')
            ->sessionCalled('Chat builder');
        $inbox = $this->journal->fixtures(ChatFixtures::class)->pairChatBetween('Owner', 'Chat builder')
            ->pairChatOf('Owner', 'Chat builder');

        $this->journal->sinkCommands()->sinkReply(SendMessageCommand::class, strtolower((string) Str::ulid()));

        $this->journal->route('POST', 'chat.send', payload: [
            'inboxId' => $inbox->id,
            'body' => 'Still there?',
            'agent' => $session->agent_id,
            'expectedSessionId' => $session->id,
        ], headers: ['Idempotency-Key' => strtolower((string) Str::ulid())])->assertRedirect();

        $this->journal->assertDispatched(StartProfileMainCommand::class, times: 0)
            ->assertDispatched(SendMessageCommand::class, ['body' => 'Still there?']);
    }

    private static function receiptFor(string $requestId, string $agentId): StartReceipt
    {
        return new StartReceipt(
            $requestId,
            strtolower((string) Str::ulid()),
            $agentId,
            new SelectedDriver(
                DefaultDrivers::CLAUDE_CODE,
                'claude-opus-5-5',
                'medium',
                ModelSelection::fromInput('default'),
                new SelectionSource(DriverSourceType::Profile, 'journal-main', 4),
            ),
            true,
            ConversationModeType::New,
            'claude-opus-5-5',
            [],
        );
    }

    protected function arrange(TestJournal $journal): RouteCall
    {
        $inbox = $journal->owner()->inboxCalled('Owner');

        return RouteCall::recorded('chat-send', ['01JPAGEREQUESTINBOX0000000' => $inbox->id])
            ->reply(SendMessageCommand::class, Str::ulid())
            ->expects(SendMessageCommand::class, ['inboxId' => $inbox->id, 'body' => 'Hello']);
    }
}
