<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Support\Access\AccessSettings;
use App\Support\ActorIdentity;
use App\Support\Command;
use App\Support\RequestKey;
use Domain\Chat\ChatDomain;
use Domain\Chat\Commands\DockSource\DockSourceCommand;
use Domain\Chat\Enums\DockOutcome;
use Domain\Chat\Exceptions\ChatUnavailable;
use Domain\Chat\Models\DockPlacement;
use Domain\Chat\Support\DockRequests;
use Domain\Chat\Tests\TestCase;
use Domain\Chat\Values\DockResult;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;

/**
 * A user docks a source in a conversation once: a second dock of it answers the placement it has, and an agent the
 * user cannot see or a conversation the user takes no part in is refused before anything is docked.
 */
final class DockSourceTest extends TestCase
{
    use CommitsHookRows;

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
    ];

    private User $owner;

    private string $agentId;

    private string $conversationId;

    private Task $task;

    /**
     * Chat with Tasks beside it, since a task is what these tests dock.
     */
    private const string PLACEMENT_TITLE = 'Ship the dock';

    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class, TasksDomain::class);
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
            'arguments' => ['type' => 'tasks.task', 'id' => $this->task->id, 'request_key' => 'forged-dock'],
        ])->assertBadRequest()->assertJsonPath('error.code', -32602);
        $this->journal->relayAgentCommands($helper);
        $this->artisan('dock:add', ['type' => 'tasks.task', 'id' => $this->task->id])->assertFailed();

        $this->assertSame(0, DockPlacement::query()->count());
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
}
