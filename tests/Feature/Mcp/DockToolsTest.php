<?php

declare(strict_types=1);

namespace Tests\Feature\Mcp;

use App\Actors\Support\ActorIdentity;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Chat\Models\DockPlacement;
use Domain\Tasks\Models\Task;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\OpensPairChats;
use Tests\Support\SendsMcpFrames;
use Tests\Support\SendsSignedCalls;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\Support\WritesInboxMessages;
use Tests\TestCase;

/**
 * An MCP caller docks, lists and undocks through the same commands and receipts as journal dock, and its list holds
 * the same safe facts; a helper without the dock grant is refused on MCP and on the journal alike.
 */
#[TimeLimit(5, 'Signed calls cover the dock tools, the journal list and a refused helper.')]
final class DockToolsTest extends TestCase
{
    use CommitsHookRows;
    use OpensPairChats;
    use SendsMcpFrames;
    use SendsSignedCalls;
    use WritesInboxMessages;

    private const string PLACEMENT_TITLE = 'Ship the dock';

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'start_tokens',
        'agent_stacks',
        'hook_calls',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
        'command_receipts',
        'links',
        'tasks',
        'number_groups',
        'conversations',
        'dock_placements',
    ];

    private User $owner;

    private Task $task;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->task = Task::factory()->create(['title' => 'Ship the dock']);
    }

    public function test_mcp_docks_lists_and_undocks_with_the_receipts_and_safe_facts_of_journal_dock(): void
    {
        $caller = $this->startInConversation('main-agent');
        $add = ['type' => 'tasks.task', 'id' => $this->task->id, 'request_key' => 'dock-add'];

        $placementId = $this->callMcpTool($caller, 'dock_add', $add)
            ->assertJsonPath('result.structuredContent.outcome', 'added')
            ->json('result.structuredContent.placementId');
        $listed = $this->callMcpTool($caller, 'dock_list')
            ->assertJsonPath('result.structuredContent.placements.0.placementId', $placementId)
            ->assertJsonPath('result.structuredContent.placements.0.title', self::PLACEMENT_TITLE)
            ->assertJsonPath('result.structuredContent.placements.0.state', 'shown')
            ->json('result.structuredContent.placements.0');
        $this->runCommandsAs($caller);
        $this->artisan('dock:list', ['--json' => true])
            ->expectsOutputToContain((string) json_encode($listed, JSON_UNESCAPED_SLASHES))
            ->assertExitCode(0);

        $this->callMcpTool($caller, 'dock_remove', [
            'placement_id' => $placementId,
            'type' => 'tasks.task',
            'source_id' => $this->task->id,
            'request_key' => 'dock-remove',
        ])->assertJsonPath('result.structuredContent.outcome', 'removed');
        $this->callMcpTool($caller, 'dock_add', $add)
            ->assertJsonPath('result.structuredContent.outcome', 'added')
            ->assertJsonPath('result.structuredContent.placementId', $placementId);

        $this->assertSame(0, DockPlacement::query()->count());
    }

    public function test_a_helper_without_the_dock_grant_is_refused_on_mcp_and_on_the_journal(): void
    {
        $helper = $this->startInConversation('read-only-helper');

        $this->sendMcp($helper, 'tools/call', [
            'name' => 'dock_add',
            'arguments' => ['type' => 'tasks.task', 'id' => $this->task->id, 'request_key' => 'forged-dock'],
        ])->assertBadRequest()->assertJsonPath('error.code', -32602);
        $this->runCommandsAs($helper);
        $this->artisan('dock:add', ['type' => 'tasks.task', 'id' => $this->task->id])->assertFailed();

        $this->assertSame(0, DockPlacement::query()->count());
    }

    private function startInConversation(string $profile): TestStart
    {
        $start = TestStart::start($profile);
        $this->pairChat(ActorIdentity::of($this->owner), ActorIdentity::of($start->agent));

        return $start;
    }
}
