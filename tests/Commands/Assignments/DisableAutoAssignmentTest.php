<?php

declare(strict_types=1);

namespace Tests\Commands\Assignments;

use App\Commands\Assignments\DisableAutoAssignment\DisableAutoAssignmentCommand;
use App\Commands\Assignments\EnableAutoAssignment\EnableAutoAssignmentCommand;
use App\Contracts\Assignments\AutoAssignmentResolver;
use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandBus;
use App\Support\ActorIdentity;
use App\Support\AutoAssignmentChange;
use App\Support\AutoAssignmentFact;
use App\Support\AutoAssignmentInput;
use App\Support\AutoAssignmentKey;
use App\Support\PoolReference;
use Domain\Tasks\Models\Task;
use Domain\Tasks\Support\TaskType;
use Domain\Tasks\TasksDomain;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * The owner switches an agent's pool off at the revision they read.
 */
#[TestsCommand(DisableAutoAssignmentCommand::class)]
final class DisableAutoAssignmentTest extends TestCase
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

    public function test_an_enabled_pool_is_switched_off(): void
    {
        $pool = new PoolReference('tasks.named', null, [Task::factory()->create()->id]);
        $this->runCommand(new EnableAutoAssignmentCommand(new AutoAssignmentInput($this->key, $pool, 1), 0));

        $this->runCommand(new DisableAutoAssignmentCommand($this->key, 1));

        $this->assertFalse($this->fact()->isEnabled);
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
}
