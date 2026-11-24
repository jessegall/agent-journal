<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Commands\ConfigureAutoAssignment\ConfigureAutoAssignmentCommand;
use App\Commands\DisableAutoAssignment\DisableAutoAssignmentCommand;
use App\Commands\EnableAutoAssignment\EnableAutoAssignmentCommand;
use App\Contracts\Assignments\AutoAssignmentResolver;
use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandBus;
use App\Exceptions\AutoAssignmentDenied;
use App\Exceptions\AutoAssignmentPoolUnknown;
use App\Exceptions\InvalidRecordIds;
use App\Support\AutoAssignmentChange;
use App\Support\AutoAssignmentFact;
use App\Support\AutoAssignmentInput;
use App\Support\PoolReference;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\Assignments\OpenTaskPoolFactory;
use Tests\Support\CommitsHookRows;
use Tests\Support\HasAutoAssignmentWorker;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * Enabling, configuring and disabling an auto-assignment through the bus: the owner sets an agent's pool and size, an
 * agent may not set its own, and a pool no domain offers or a reference its factory refuses leaves the fact as it
 * was.
 */
final class AutoAssignmentCommandsTest extends TestCase
{
    use CommitsHookRows;
    use HasAutoAssignmentWorker;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'start_tokens',
        'tasks',
        'auto_assignments',
        'command_receipts',
    ];

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

        $this->runCommand(new DisableAutoAssignmentCommand($this->key, 1));

        $this->assertFalse($this->fact()->isEnabled);
    }

    public function test_an_agent_enabling_itself_is_refused_and_nothing_is_stored(): void
    {
        $this->startRequestAs($this->worker->agent->id, $this->worker->session->id);

        $this->assertThrows(
            fn () => $this->runCommand(
                new EnableAutoAssignmentCommand(new AutoAssignmentInput($this->key, self::open(), 1), 0),
            ),
            AutoAssignmentDenied::class,
        );
        $this->assertTrue($this->resolver()->forActor($this->key)->isEmpty());
    }

    public function test_a_pool_that_is_not_offered_or_not_valid_leaves_the_fact_as_it_was(): void
    {
        $this->runCommand(new EnableAutoAssignmentCommand(new AutoAssignmentInput($this->key, self::open(), 2), 0));
        $class = new PoolReference(OpenTaskPoolFactory::class, null, []);

        $this->assertThrows(
            fn () => $this->runCommand(new ConfigureAutoAssignmentCommand(new AutoAssignmentInput($this->key, $class, 4), 1)),
            AutoAssignmentPoolUnknown::class,
        );
        $this->assertThrows(
            fn () => $this->runCommand(new ConfigureAutoAssignmentCommand(
                new AutoAssignmentInput($this->key, new PoolReference('plans.unknown', null, []), 4),
                1,
            )),
            AutoAssignmentPoolUnknown::class,
        );
        $this->assertThrows(
            fn () => new PoolReference('tasks.named', null, array_map(TestIds::of(...), range(1, 1001))),
            InvalidRecordIds::class,
        );
        $this->assertThrows(
            fn () => $this->runCommand(new ConfigureAutoAssignmentCommand(
                new AutoAssignmentInput($this->key, new PoolReference('tasks.named', null, [TestIds::of(99)]), 4),
                1,
            )),
            TaskMissing::class,
        );

        $fact = $this->fact();
        $this->assertTrue($fact->pool->isSameAs(self::open()));
        $this->assertSame(2, $fact->size);
        $this->assertSame(1, $fact->revision);
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
