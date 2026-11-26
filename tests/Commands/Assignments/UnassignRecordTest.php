<?php

declare(strict_types=1);

namespace Tests\Commands\Assignments;

use App\Assignments\Commands\AssignRecord\AssignRecordCommand;
use App\Assignments\Commands\UnassignRecord\UnassignRecordCommand;
use App\Bus\Contracts\CommandBus;
use App\Bus\RequestKey;
use App\Models\Records\AssignmentRecord;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * After a record's assignment is taken away, a retry of the first assign under the same key returns its first result.
 */
#[TestsCommand(UnassignRecordCommand::class)]
final class UnassignRecordTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'users',
        'agents',
        'tasks',
        'inboxes',
        'inbox_members',
        'assignments',
        'command_receipts',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->installInboxes();

        $this->journal->owner();
    }

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    public function test_a_retry_with_the_same_key_returns_the_first_result_after_the_assignment_was_removed(): void
    {
        $agent = $this->journal->idleAgent('Builder', 'read-only-helper')->agentCalled('Builder');
        $task = Task::factory()->create()->assignmentIdentity();
        $bus = $this->app->make(CommandBus::class);
        $this->app->make(RequestKey::class)->set('assign-the-builder');
        $first = $bus->run(new AssignRecordCommand($task, $agent->assigneeIdentity()));
        $this->app->make(RequestKey::class)->set('unassign-the-builder');
        $bus->run(new UnassignRecordCommand($task, $first->outcomes[0]->current->reference));

        $this->app->make(RequestKey::class)->set('assign-the-builder');
        $retry = $bus->run(new AssignRecordCommand($task, $agent->assigneeIdentity()));

        $this->assertEquals($first, $retry);
        $this->assertSame(0, AssignmentRecord::query()->forRecord($task)->count());
    }
}
