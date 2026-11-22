<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Commands\AssignRecordForMaintenance\AssignRecordForMaintenanceCommand;
use App\Commands\ReassignRecord\ReassignRecordCommand;
use App\Commands\UnassignRecord\UnassignRecordCommand;
use App\Contracts\CommandBus;
use App\Contracts\CurrentActorSetter;
use App\Enums\CommandEntry;
use App\Exceptions\CommandNotRegistered;
use App\Exceptions\EngineAccessRefused;
use App\Models\Agent;
use App\Models\AssignmentRecord;
use App\Support\CommandEntrance;
use App\Support\EngineAccess;
use App\Support\EngineActor;
use App\Support\RequestKey;
use App\Values\TrustedEntryAuthority;
use Domain\Tasks\Models\Task;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

final class EngineAssignmentTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = ['assignments', 'command_receipts', 'tasks', 'agents'];

    public function test_fill_scope_can_assign_but_cannot_reassign_or_unassign(): void
    {
        $record = Task::factory()->create()->assignmentIdentity();
        $holder = Agent::create('Recipient', 'writing-helper')->assigneeIdentity();
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
        $holder = Agent::create('Recipient', 'writing-helper')->assigneeIdentity();
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
        $this->app->make(CurrentActorSetter::class)->set(new EngineActor(), new TrustedEntryAuthority('engine pass'));
    }
}
