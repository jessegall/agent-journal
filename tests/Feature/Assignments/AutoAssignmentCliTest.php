<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Models\Access\User;
use App\Support\Access\AccessSettings;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Facades\Artisan;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsSignedCalls;
use Tests\TestCase;

/**
 * The auto-assignment commands of the journal shell: a main agent enables a worker for named tasks given by number,
 * shows its status, lists it and the pools of tasks, and a stale revision prints the refusal. There is no run-now
 * command.
 */
final class AutoAssignmentCliTest extends TestCase
{
    use CommitsHookRows;
    use SendsSignedCalls;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'session_tokens',
        'tasks',
        'assignments',
        'auto_assignments',
        'command_receipts',
    ];

    private TestStart $main;

    private TestStart $worker;

    protected function setUp(): void
    {
        parent::setUp();

        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->main = TestStart::start('main-agent');
        $this->worker = TestStart::start('writing-helper');
        $this->runCommandsAs($this->main);
    }

    public function test_a_main_agent_enables_named_tasks_by_number_and_shows_the_status(): void
    {
        $tasks = array_map(fn () => Task::factory()->create(), range(1, 3));
        $worker = "agent:{$this->worker->agent->id}";

        $this->artisan('assignment:auto-enable', [
            'actor' => $worker,
            'type' => 'tasks.task',
            '--pool' => 'tasks.named',
            '--task' => [$tasks[2]->number, $tasks[0]->number, $tasks[1]->number],
            '--size' => 3,
            '--json' => true,
        ])->expectsOutputToContain('"revision":1')->assertExitCode(0);

        $this->artisan('assignment:auto-show', ['actor' => $worker, 'type' => 'tasks.task', '--json' => true])
            ->expectsOutputToContain('"state":"ready","stateLabel":"Ready","revision":1,"pool":"Named tasks","size":3')
            ->assertExitCode(0);

        $this->artisan('assignment:auto-list', ['actor' => $worker, '--json' => true])
            ->expectsOutputToContain('"pool":"tasks.named"')
            ->assertExitCode(0);

        $this->artisan('assignment:auto-enable', [
            'actor' => $worker,
            'type' => 'tasks.task',
            '--pool' => 'tasks.open',
            '--revision' => 0,
        ])->expectsOutputToContain('revision 1, not 0')->assertExitCode(1);
    }

    public function test_the_pools_of_tasks_are_listed_with_their_labels(): void
    {
        $this->artisan('assignment:auto-pools', ['type' => 'tasks.task', '--json' => true])
            ->expectsOutputToContain(
                '"label":"Open tasks"},{"key":"tasks.named","label":"Named tasks"},{"key":"plans.tasks","label":"Tasks in a started plan"}',
            )
            ->assertExitCode(0);
    }

    public function test_there_is_no_run_now_command(): void
    {
        $names = array_keys(Artisan::all());
        sort($names);

        $this->assertSame(
            [
                'assignment:auto-configure',
                'assignment:auto-disable',
                'assignment:auto-enable',
                'assignment:auto-list',
                'assignment:auto-pools',
                'assignment:auto-show',
            ],
            array_values(array_filter($names, fn (string $name) => str_starts_with($name, 'assignment:auto'))),
        );
    }
}
