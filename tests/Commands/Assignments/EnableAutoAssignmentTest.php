<?php

declare(strict_types=1);

namespace Tests\Commands\Assignments;

use App\Commands\Assignments\EnableAutoAssignment\EnableAutoAssignmentCommand;
use App\Contracts\Assignments\AutoAssignmentResolver;
use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandBus;
use App\Exceptions\AutoAssignmentDenied;
use App\Support\ActorIdentity;
use App\Support\AutoAssignmentChange;
use App\Support\AutoAssignmentFact;
use App\Support\AutoAssignmentInput;
use App\Support\AutoAssignmentKey;
use App\Support\PoolReference;
use Domain\Plans\PlansDomain;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\TaskType;
use Domain\Tasks\TasksDomain;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\TestCase;

/**
 * The owner gives an agent a named pool of tasks to take on its own, kept in the pool's order at its first revision;
 * an agent enabling itself is refused and nothing is stored.
 */
final class EnableAutoAssignmentTest extends TestCase
{
    use CommitsHookRows;

    private TestStart $worker;

    private AutoAssignmentKey $key;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'session_tokens',
        'tasks',
        'auto_assignments',
        'command_receipts',
        'assignments',
        'number_groups',
        'inboxes',
        'inbox_members',
    ];

    private TestStart $main;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->idleAgent('Worker', 'writing-helper')->startSession('Worker', 'Worker');
        $this->worker = $this->journal->testStartCalled('Worker');
        $this->key = new AutoAssignmentKey(ActorIdentity::of($this->worker->agent), TaskType::linkType());
        $this->journal->actAs('Owner');
    }

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class, TasksDomain::class);
    }

    public function test_the_owner_enables_a_named_pool_for_an_agent(): void
    {
        [$first, $second, $third] = array_map(fn () => Task::factory()->create()->id, range(1, 3));
        $pool = new PoolReference('tasks.named', null, [$third, $first, $second]);

        $change = $this->runCommand(new EnableAutoAssignmentCommand(new AutoAssignmentInput($this->key, $pool, 3), 0));

        $this->assertEquals(new AutoAssignmentChange(true, 1), $change);
        $fact = $this->fact();
        $this->assertSame([$third, $first, $second], $fact->pool->recordIds);
        $this->assertSame(3, $fact->size);
        $this->assertSame(1, $fact->revision);
    }

    public function test_an_agent_enabling_itself_is_refused_and_nothing_is_stored(): void
    {
        $this->journal->actAsAgentIds($this->worker->agent->id, $this->worker->session->id);

        $this->assertThrows(
            fn () => $this->runCommand(
                new EnableAutoAssignmentCommand(new AutoAssignmentInput($this->key, self::open(), 1), 0),
            ),
            AutoAssignmentDenied::class,
        );
        $this->assertTrue($this->resolver()->forActor($this->key)->isEmpty());
    }

    public function test_a_main_agent_enables_named_tasks_by_number_and_shows_the_status(): void
    {
        $owner = $this->journal->ownerUser();
        $this->main = TestStart::start('main-agent');
        $this->worker = TestStart::start('writing-helper');
        $this->journal->relayAgentCommands($this->main);

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

    /**
     * @param  Command<AutoAssignmentChange>  $command
     */
    private function runCommand(Command $command): AutoAssignmentChange
    {
        return $this->app->make(CommandBus::class)->run($command);
    }

    private function resolver(): AutoAssignmentResolver
    {
        return $this->app->make(AutoAssignmentResolver::class);
    }

    private function fact(): AutoAssignmentFact
    {
        return $this->resolver()->forActor($this->key)->get();
    }

    private static function open(): PoolReference
    {
        return new PoolReference('tasks.open', null, []);
    }
}
