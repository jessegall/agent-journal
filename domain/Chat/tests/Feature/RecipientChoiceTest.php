<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Feature;

use App\Commands\Inboxes\InstallInboxes\InstallInboxesCommand;
use App\Contracts\Assignments\AssignmentTransaction;
use App\Enums\Accounts\CommandEntry;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use App\Support\EntryDispatchers;
use App\Support\MainInboxHandover;
use App\Support\StartSessions;
use Domain\Chat\Http\Requests\ConversationRequest;
use Domain\Chat\Models\Conversation;
use Domain\Chat\Models\DirectChat;
use Domain\Chat\Tests\TestCase;
use Inertia\Testing\AssertableInertia;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\WritesInboxMessages;

/**
 * Choosing an agent in Chat resolves it to a fixed inbox: the agent seated at main is reached at main's inbox, any
 * other at its own, and that inbox id is what the conversation and its sends carry.
 */
final class RecipientChoiceTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;
    use WritesInboxMessages;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'inboxes',
        'assignments',
        'command_receipts',
        'messages',
        'links',
        'conversations',
        'direct_chats',
    ];

    public function test_each_agent_is_reached_in_its_own_chat_with_the_viewer(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));

        $this->app->make(EntryDispatchers::class)
            ->runAsJournal(CommandEntry::HostControl, 'inbox install', new InstallInboxesCommand());

        $this->inboxOf(ActorIdentity::of($owner));
        $main = $this->start('Main');
        $helper = $this->start('Helper');
        $this->startUserRequestAs($owner->id);

        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(MainInboxHandover::class)->takeOver(Agent::query()->findOrFail($main[0])),
        );

        $mainShown = $this->destinationShownFor($owner, $main[0]);
        $helperShown = $this->destinationShownFor($owner, $helper[0]);

        $this->assertNotSame($mainShown, $helperShown);
        $this->assertTrue($this->isPairChatWith($mainShown, $main[0]));
        $this->assertTrue($this->isPairChatWith($helperShown, $helper[0]));
    }

    private function isPairChatWith(string $inboxId, string $agentId): bool
    {
        $conversation = Conversation::query()->where('inbox_id', $inboxId)->sole();

        return DirectChat::findFor($conversation)?->holds(ActorIdentity::ofClass(Agent::class, $agentId)) === true;
    }

    /**
     * @return array{string, string} the agent id and its session id
     */
    private function start(string $name): array
    {
        $agent = Agent::create($name, 'main-agent');

        $session = $this->app->make(StartSessions::class)
            ->start($agent, TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;

        $this->inboxOf(ActorIdentity::ofClass(Agent::class, $agent->id));

        return [
            $agent->id,
            $session->id,
        ];
    }

    private function destinationShownFor(User $owner, string $agentId): string
    {
        $window = ConversationRequest::queryFor($agentId);
        $destination = '';

        $this->actingAs($owner)->get(route('home', $window, false))->assertInertia(
            function (AssertableInertia $page) use (&$destination): AssertableInertia {
                $read = function (AssertableInertia $reload) use (&$destination): AssertableInertia {
                    $window = $reload->toArray()['props']['window_chat_conversation'];
                    $destination = $window['data']['conversation']['inboxId'];

                    return $reload;
                };

                return $page->reloadOnly('window_chat_conversation', $read);
            },
        );

        return $destination;
    }
}
