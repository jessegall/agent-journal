<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Messages\Message;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use App\Support\Command;
use App\Support\RequestKey;
use Domain\Chat\ChatDomain;
use Domain\Chat\Commands\DockSource\DockSourceCommand;
use Domain\Chat\Enums\DockOutcome;
use Domain\Chat\Exceptions\ChatUnavailable;
use Domain\Chat\Http\Requests\ConversationRequest;
use Domain\Chat\Models\DockPlacement;
use Domain\Chat\Support\DockRequests;
use Domain\Chat\Tests\TestCase;
use Domain\Chat\Values\DockResult;
use Domain\Documents\DocumentsDomain;
use Domain\Rules\RulesDomain;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Illuminate\Support\Str;
use Inertia\Testing\AssertableInertia;
use Tests\Fixtures\Agents\TestStart;
use Tests\Fixtures\Modules\Notes\Models\Note;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\InstallsNotesModule;

/**
 * A user docks a source in a conversation once: a second dock of it answers the placement it has, and an agent the
 * user cannot see or a conversation the user takes no part in is refused before anything is docked.
 */
final class DockSourceTest extends TestCase
{
    use CommitsHookRows;
    use InstallsNotesModule;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'inboxes',
        'inbox_members',
        'assignments',
        'command_receipts',
        'links',
        'tasks',
        'dock_placements',
        'number_groups',
        'messages',
        'documents',
        'document_revisions',
        'document_drafts',
        'document_closes',
        'reports',
    ];

    private User $owner;

    private string $agentId;

    private string $conversationId;

    private Task $task;

    /**
     * Chat with Tasks beside it, since a task is what these tests dock.
     */
    private const string PLACEMENT_TITLE = 'Ship the dock';

    private TestStart $start;

    private const string KEY = '01JD8X0G9M3QZ6V4K2DOCKADD01';

    private string $chatInboxId;

    private TestStart $agent;

    private const string TASK_TITLE = 'Feed the cat';

    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(
            ChatDomain::class,
            TasksDomain::class,
            RulesDomain::class,
            DocumentsDomain::class,
        );
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = $this->journal->owner()->ownerUser();

        $this->agentId = $this->journal->idleAgent('Builder')
            ->startSession('Builder', 'Builder')
            ->sessionCalled('Builder')->agent_id;

        $this->journal->inboxes()->pairChat(
            ActorIdentity::of($this->owner),
            ActorIdentity::ofClass(Agent::class, $this->agentId),
        );

        $this->task = Task::factory()->create(['title' => 'Ship the dock']);
        $this->journal->actAsUserId($this->owner->id);
        $this->conversationId = $this->app->make(DockRequests::class)->inboxWith($this->agentId)->id;
    }

    public function test_a_second_dock_of_one_source_answers_its_one_placement(): void
    {
        $added = $this->runKeyed($this->dockTask(), (string) Str::ulid());
        $present = $this->runKeyed($this->dockTask(), (string) Str::ulid());

        $this->assertSame([
            DockOutcome::Added,
            DockOutcome::Present,
        ], [
            $added->outcome,
            $present->outcome,
        ]);

        $this->assertSame($added->placementId, $present->placementId);
        $this->assertSame(1, DockPlacement::query()->count());
    }

    public function test_an_agent_out_of_sight_is_refused_before_anything_is_docked(): void
    {
        $this->expectException(ChatUnavailable::class);

        try {
            $this->app->make(DockRequests::class)->inboxWith(strtolower((string) Str::ulid()));
        } finally {
            $this->assertSame(0, DockPlacement::query()->count());
        }
    }

    public function test_a_conversation_the_user_takes_no_part_in_is_refused(): void
    {
        $strangers = $this->journal->inboxes()->pairChat(
            ActorIdentity::ofClass(Agent::class, 'agent-one'),
            ActorIdentity::ofClass(Agent::class, 'agent-two'),
        );

        $this->expectException(ChatUnavailable::class);

        $this->runKeyed(
            new DockSourceCommand($strangers->id, 'tasks.task', $this->task->id),
            (string) Str::ulid(),
        );
    }

    public function test_mcp_docks_lists_and_undocks_with_the_receipts_and_safe_facts_of_journal_dock(): void
    {
        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));

        $caller = $this->startInConversation('main-agent');
        $add = ['type' => 'tasks.task', 'id' => $this->task->id, 'request_key' => 'dock-add'];

        $placementId = $this->journal->mcpTool($caller, 'dock_add', $add)->assertOk()
            ->assertJsonPath('result.structuredContent.outcome', 'added')
            ->json('result.structuredContent.placementId');

        $listed = $this->journal->mcpTool($caller, 'dock_list')->assertOk()
            ->assertJsonPath('result.structuredContent.placements.0.placementId', $placementId)
            ->assertJsonPath('result.structuredContent.placements.0.title', self::PLACEMENT_TITLE)
            ->assertJsonPath('result.structuredContent.placements.0.state', 'shown')
            ->json('result.structuredContent.placements.0');

        $this->journal->relayAgentCommands($caller);

        $this->artisan('dock:list', ['--json' => true])
            ->expectsOutputToContain((string) json_encode($listed, JSON_UNESCAPED_SLASHES))
            ->assertExitCode(0);

        $this->journal->mcpTool($caller, 'dock_remove', [
            'placement_id' => $placementId,
            'type' => 'tasks.task',
            'source_id' => $this->task->id,
            'request_key' => 'dock-remove',
        ])->assertOk()->assertJsonPath('result.structuredContent.outcome', 'removed');

        $this->journal->mcpTool($caller, 'dock_add', $add)->assertOk()
            ->assertJsonPath('result.structuredContent.outcome', 'added')
            ->assertJsonPath('result.structuredContent.placementId', $placementId);

        $this->assertSame(0, DockPlacement::query()->count());
    }

    public function test_a_helper_without_the_dock_grant_is_refused_on_mcp_and_on_the_journal(): void
    {
        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));

        $helper = $this->startInConversation('read-only-helper');

        $this->journal->mcpRequest($helper, 'tools/call', [
            'name' => 'dock_add',
            'arguments' => [
                'type' => 'tasks.task',
                'id' => $this->task->id,
                'request_key' => 'forged-dock',
            ],
        ])->assertBadRequest()->assertJsonPath('error.code', -32602);

        $this->journal->relayAgentCommands($helper);
        $this->artisan('dock:add', [
            'type' => 'tasks.task',
            'id' => $this->task->id,
        ])->assertFailed();

        $this->assertSame(0, DockPlacement::query()->count());
    }

    public function test_an_agent_docks_lists_and_removes_a_record_and_a_retried_add_answers_its_first_receipt(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->start = TestStart::start();
        $this->journal->inboxes()->pairChat(ActorIdentity::of($owner), ActorIdentity::of($this->start->agent));

        $this->journal->relayAgentCommands($this->start);
        $add = ['type' => 'tasks.task', 'id' => $this->task->id, '--request-key' => self::KEY, '--json' => true];

        $this->artisan('dock:add', $add)->expectsOutputToContain('"outcome":"added"')->assertExitCode(0);
        $placement = DockPlacement::query()->sole();

        $this->artisan('dock:list', ['--json' => true])
            ->expectsOutputToContain(
                "\"placementId\":\"{$placement->id}\",\"type\":\"tasks.task\",\"sourceId\":\"{$this->task->id}\","
                .'"title":"Ship the dock","state":"shown"',
            )
            ->doesntExpectOutputToContain('"root"')
            ->assertExitCode(0);

        $this->artisan('dock:remove', [
            'placement' => $placement->id,
            '--json' => true,
        ])
            ->expectsOutputToContain('"outcome":"removed"')
            ->assertExitCode(0);

        $this->artisan('dock:add', $add)
            ->expectsOutputToContain("\"outcome\":\"added\",\"placementId\":\"{$placement->id}\"")
            ->assertExitCode(0);

        $this->assertSame(0, DockPlacement::query()->count());
    }

    public function test_an_agent_in_several_conversations_names_one_before_anything_is_docked(): void
    {
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->start = TestStart::start();
        $this->journal->inboxes()->pairChat(ActorIdentity::of($owner), ActorIdentity::of($this->start->agent));

        $this->journal->inboxes()->pairChat(
            ActorIdentity::of($this->start->agent),
            ActorIdentity::ofClass(Agent::class, 'another-agent'),
        );

        $this->journal->relayAgentCommands($this->start);

        $this->artisan('dock:add', [
            'type' => 'tasks.task',
            'id' => $this->task->id,
        ])
            ->expectsOutputToContain(ChatUnavailable::unnamed()->getMessage())
            ->assertFailed();

        $this->assertSame(0, DockPlacement::query()->count());
    }

    public function test_a_message_docked_from_its_row_answers_added_then_present_and_shows_its_first_line(): void
    {
        $owner = $this->journal->ownerUser();

        $session = $this->journal->idleAgent('Dock builder')
            ->startSession('Dock builder', 'Dock builder')
            ->sessionCalled('Dock builder');

        $message = $this->journal->inboxes()->post(
            $this->journal->inboxes()->personal(ActorIdentity::of($owner)),
            $owner,
            "Build ready\nAll checks passed.",
        );

        $inboxId = $this->journal->inboxes()->pairChat(
            ActorIdentity::of($owner),
            ActorIdentity::ofClass(Agent::class, $session->agent_id),
        )->id;

        $dock = ['inboxId' => $inboxId, 'type' => Message::linkType(), 'id' => $message->id];

        $this->actingAs($owner)->postJson('/chat/dock', $dock)->assertSuccessful()->assertJson(['outcome' => 'added']);
        $again = $this->actingAs($owner)->postJson('/chat/dock', $dock);
        $again->assertSuccessful()->assertJson(['outcome' => 'present']);

        $query = ConversationRequest::queryFor($session->agent_id);
        $this->assertSame(['Build ready'], $this->dockedTitles($owner, $query));
    }

    public function test_notes_dock_through_the_chat_the_journal_and_mcp_and_each_side_sees_what_it_may_read(): void
    {
        $this->createNotesTables();
        $this->installNotesModule();
        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->agent = TestStart::start();

        $this->chatInboxId = $this->journal->inboxes()->pairChat(
            ActorIdentity::of($this->owner),
            ActorIdentity::of($this->agent->agent),
        )->id;

        $ownersNote = new Note(['text' => 'Water the plants']);
        $ownersNote->belongTo(ActorIdentity::of($this->owner));
        $ownersNote->save();
        $agentsNote = new Note(['text' => 'Feed the cat']);
        $agentsNote->saveFor($this->agent->agent->id);

        $this->actingAs($this->owner)
            ->postJson(
                '/chat/dock',
                [
                    'inboxId' => $this->chatInboxId,
                    'type' => Note::linkType(),
                    'id' => $ownersNote->id,
                ],
            )
            ->assertJson(['outcome' => 'added']);

        $this->journal->relayAgentCommands($this->agent);

        $this->artisan('dock:add', [
            'type' => Note::linkType(),
            'id' => $agentsNote->id,
            '--json' => true,
        ])
            ->expectsOutputToContain('"outcome":"added"')
            ->assertExitCode(0);

        $this->journal->mcpTool($this->agent, 'dock_list')->assertOk()
            ->assertJsonPath('result.structuredContent.placements.0.state', 'unavailable')
            ->assertJsonPath('result.structuredContent.placements.0.title', '')
            ->assertJsonPath('result.structuredContent.placements.1.title', self::TASK_TITLE)
            ->assertJsonPath('result.structuredContent.placements.1.state', 'shown');

        $placement = DockPlacement::query()->where('dockable_id', $agentsNote->id)->sole();

        $this->journal->mcpTool($this->agent, 'dock_remove', [
            'placement_id' => $placement->id,
            'type' => Note::linkType(),
            'source_id' => $agentsNote->id,
            'request_key' => 'undock-note',
        ])->assertOk()->assertJsonPath('result.structuredContent.outcome', 'removed');

        $this->assertSame(1, DockPlacement::query()->count());
    }

    private function dockTask(): DockSourceCommand
    {
        return new DockSourceCommand($this->conversationId, 'tasks.task', $this->task->id);
    }

    /**
     * @param  Command<DockResult>  $command
     */
    private function runKeyed(Command $command, string $key): DockResult
    {
        $this->journal->actAsUserId($this->owner->id);
        $this->app->make(RequestKey::class)->set($key);

        try {
            return $this->app->make(CommandBus::class)->run($command);
        } finally {
            $this->app->make(RequestKey::class)->forget();
        }
    }

    private function startInConversation(string $profile): TestStart
    {
        $start = TestStart::start($profile);
        $this->journal->inboxes()->pairChat(ActorIdentity::of($this->owner), ActorIdentity::of($start->agent));

        return $start;
    }

    /**
     * @param  array<string, mixed>  $window
     * @return list<string>
     */
    private function dockedTitles(User $owner, array $window): array
    {
        $titles = [];

        $this->actingAs($owner)->get(route('home', $window, false))->assertInertia(
            function (AssertableInertia $page) use (&$titles): AssertableInertia {
                $read = function (AssertableInertia $reload) use (&$titles): AssertableInertia {
                    $conversation = $reload->toArray()['props']['window_chat_conversation']['data']['conversation'];
                    $titles = array_column($conversation['dock']['cards'], 'accessibleName');

                    return $reload;
                };

                return $page->reloadOnly('window_chat_conversation', $read);
            },
        );

        return $titles;
    }
}
