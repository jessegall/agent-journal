<?php

declare(strict_types=1);

namespace Tests\Commands\Assignments;

use App\Accounts\Enums\CommandEntry;
use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\SystemActor;
use App\Assignments\Commands\AssignRecordForMaintenance\AssignRecordForMaintenanceCommand;
use App\Assignments\Commands\ReassignRecord\ReassignRecordCommand;
use App\Assignments\Commands\UnassignRecord\UnassignRecordCommand;
use App\Bus\CommandEntrance;
use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\CommandNotRegistered;
use App\Bus\RequestKey;
use App\Engine\EngineAccess;
use App\Engine\Exceptions\EngineAccessRefused;
use App\Models\Records\AssignmentRecord;
use App\Values\TrustedEntryAuthority;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

#[TestsCommand(AssignRecordForMaintenanceCommand::class)]
final class AssignRecordForMaintenanceTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['assignments', 'command_receipts', 'tasks', 'agents'];

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    public function test_fill_scope_can_assign_but_cannot_reassign_or_unassign(): void
    {
        $record = Task::factory()->create()->assignmentIdentity();
        $holder = $this->journal->idleAgent(
            'Recipient',
            'writing-helper',
        )->agentCalled('Recipient')->assigneeIdentity();
        $this->actAsEngine();
        $this->app->make(EngineAccess::class)->grantMaintenance(AssignRecordForMaintenanceCommand::FILL_SCOPE);
        $this->app->make(RequestKey::class)->set('engine-fill');
        $bus = $this->app->make(CommandBus::class);
        $this->assertThrows(
            fn () => $bus->run(new AssignRecordForMaintenanceCommand($record, $holder)),
            CommandNotRegistered::class,
        );

        $this->app->make(CommandEntrance::class)->through(CommandEntry::EngineMaintenance, function () use (
            $bus,
            $record,
            $holder,
        ): void {
            $result = $bus->run(new AssignRecordForMaintenanceCommand($record, $holder));
            $assignment = $result->outcomes[0]->current;
            $this->assertNotNull($assignment);
            $this->assertTrue($assignment->holder()->isSameAs($holder));
            $this->assertThrows(
                fn () => $bus->run(new ReassignRecordCommand($record, $assignment->reference, $holder)),
                CommandNotRegistered::class,
            );
            $this->assertThrows(
                fn () => $bus->run(new UnassignRecordCommand($record, $assignment->reference)),
                CommandNotRegistered::class,
            );
        });
    }

    public function test_a_missing_or_different_maintenance_scope_writes_nothing(): void
    {
        $record = Task::factory()->create()->assignmentIdentity();
        $holder = $this->journal->idleAgent(
            'Recipient',
            'writing-helper',
        )->agentCalled('Recipient')->assigneeIdentity();
        $this->actAsEngine();
        $bus = $this->app->make(CommandBus::class);
        $assign = fn () => $this->app->make(CommandEntrance::class)->through(
            CommandEntry::EngineMaintenance,
            fn () => $bus->run(new AssignRecordForMaintenanceCommand($record, $holder)),
        );
        $this->app->make(RequestKey::class)->set('missing-scope');
        $this->assertThrows($assign, EngineAccessRefused::class);
        $this->app->make(EngineAccess::class)->grantMaintenance('another.scope');
        $this->app->make(RequestKey::class)->set('different-scope');
        $this->assertThrows($assign, EngineAccessRefused::class, AssignRecordForMaintenanceCommand::FILL_SCOPE);
        $this->assertFalse(AssignmentRecord::query()->forRecord($record)->exists());
    }

    private function actAsEngine(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(new SystemActor(), new TrustedEntryAuthority('engine pass'));
    }
}
