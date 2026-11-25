<?php

declare(strict_types=1);

namespace Tests\Commands\Assignments;

use App\Commands\Assignments\ConfigureAutoAssignment\ConfigureAutoAssignmentCommand;
use App\Commands\Assignments\EnableAutoAssignment\EnableAutoAssignmentCommand;
use App\Contracts\Assignments\AutoAssignmentResolver;
use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandBus;
use App\Exceptions\AutoAssignmentPoolUnknown;
use App\Exceptions\InvalidRecordIds;
use App\Support\ActorIdentity;
use App\Support\AutoAssignmentChange;
use App\Support\AutoAssignmentFact;
use App\Support\AutoAssignmentInput;
use App\Support\AutoAssignmentKey;
use App\Support\PoolReference;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Support\Assignments\OpenTaskPoolFactory;
use Domain\Tasks\Support\TaskType;
use Domain\Tasks\TasksDomain;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * A pool that is not offered or not valid leaves the agent's pool as it was.
 */
final class ConfigureAutoAssignmentTest extends TestCase
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
    ];

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
        return DomainBoot::withRequirements(TasksDomain::class);
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
