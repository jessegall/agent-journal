<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Feature;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Chat\Models\DockPlacement;
use Domain\Chat\Tests\TestCase;
use Domain\Tasks\Models\Task;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\OpensPairChats;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsSignedCalls;
use Tests\Support\StartsAgentRequests;
use Tests\Support\WritesInboxMessages;

/**
 * An agent in its one conversation docks a record with journal dock add, sees it in dock list with only its safe
 * facts, removes it with dock remove, and a retried add answers its first receipt; an agent with several
 * conversations must name one, and nothing is docked until it does.
 */
final class DockCommandsTest extends TestCase
{
    use OpensPairChats;
    use CommitsHookRows;
    use SendsSignedCalls;
    use StartsAgentRequests;
    use WritesInboxMessages;

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

    private const string KEY = '01JD8X0G9M3QZ6V4K2DOCKADD01';

    private TestStart $start;

    private Task $task;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->start = TestStart::start();

        $this->pairChat(ActorIdentity::of($owner), ActorIdentity::of($this->start->agent));

        $this->task = Task::factory()->create(['title' => 'Ship the dock']);
    }

    public function test_an_agent_docks_lists_and_removes_a_record_and_a_retried_add_answers_its_first_receipt(): void
    {
        $this->runCommandsAs($this->start);
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

        $this->artisan('dock:remove', ['placement' => $placement->id, '--json' => true])
            ->expectsOutputToContain('"outcome":"removed"')
            ->assertExitCode(0);

        $this->artisan('dock:add', $add)
            ->expectsOutputToContain("\"outcome\":\"added\",\"placementId\":\"{$placement->id}\"")
            ->assertExitCode(0);

        $this->assertSame(0, DockPlacement::query()->count());
    }

    public function test_an_agent_in_several_conversations_names_one_before_anything_is_docked(): void
    {
        $this->pairChat(ActorIdentity::of($this->start->agent), new ActorIdentity(ActorType::Agent, 'another-agent'));

        $this->runCommandsAs($this->start);

        $this->artisan('dock:add', ['type' => 'tasks.task', 'id' => $this->task->id])
            ->expectsOutputToContain('name the one to use with --chat')
            ->assertFailed();

        $this->assertSame(0, DockPlacement::query()->count());
    }
}
