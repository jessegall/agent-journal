<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Feature;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Agents\Actions\LaunchSessions;
use App\Agents\Contracts\MainSeatTakeover;
use App\Agents\Models\Agent;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\EntryDispatchers;
use App\Desks\Commands\InstallDesks;
use App\Desks\Models\DeskRecord;
use App\Desks\Support\BuiltInDesks;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
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
        'launch_credentials',
        'agent_stacks',
        'hook_calls',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
        'command_receipts',
        'messages',
        'message_attentions',
        'links',
    ];

    public function test_the_agent_at_main_is_reached_at_mains_inbox_and_another_at_its_own(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->app->make(EntryDispatchers::class)
            ->runAsJournal(CommandEntry::HostControl, 'desk install', new InstallDesks());
        $this->inboxOf(ActorIdentity::of($owner));
        $main = $this->launch('Main');
        $helper = $this->launch('Helper');
        $this->startUserRequestAs($owner->id);
        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(MainSeatTakeover::class)->takeOver(Agent::query()->findOrFail($main[0])),
        );
        $mainInboxId = DeskRecord::query()->named(BuiltInDesks::MAIN)->sole()->inboxId();
        $helperInboxId = $this->inboxOf(new ActorIdentity(ActorType::Agent, $helper[0]))->inboxId();

        $this->assertSame($mainInboxId, $this->destinationShownFor($owner, $main[1]));
        $this->assertSame($helperInboxId, $this->destinationShownFor($owner, $helper[1]));
    }

    /**
     * @return array{string, string} the agent id and its session id
     */
    private function launch(string $name): array
    {
        $agent = Agent::named($name, 'main-agent');
        $session = $this->app->make(LaunchSessions::class)
            ->launch($agent, TestSelections::of('claude-code'), TestSelections::requestId())
            ->session;
        $this->inboxOf(new ActorIdentity(ActorType::Agent, $agent->id));

        return [$agent->id, $session->id];
    }

    private function destinationShownFor(User $owner, string $sessionId): string
    {
        $window = ['window' => ['chat.conversation' => ['session' => $sessionId]], 'session' => $sessionId];
        $destination = '';

        $this->actingAs($owner)->get(route('home', $window, false))->assertInertia(
            function (AssertableInertia $page) use (&$destination): AssertableInertia {
                $read = function (AssertableInertia $reload) use (&$destination): AssertableInertia {
                    $window = $reload->toArray()['props']['window_chat_conversation'];
                    $destination = $window['data']['conversation']['destinationInboxId'];

                    return $reload;
                };

                return $page->reloadOnly('window_chat_conversation', $read);
            },
        );

        return $destination;
    }
}
