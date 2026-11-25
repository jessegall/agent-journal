<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Commands\Assignments\AssignRecordForMaintenance\AssignRecordForMaintenanceCommand;
use App\Commands\Assignments\ReassignRecord\ReassignRecordCommand;
use App\Commands\Assignments\UnassignRecord\UnassignRecordCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Enums\Accounts\CommandEntry;
use App\Exceptions\CommandNotRegistered;
use App\Exceptions\EngineAccessRefused;
use App\Models\Agents\Agent;
use App\Models\Records\AssignmentRecord;
use App\Support\CommandEntrance;
use App\Support\EngineAccess;
use App\Support\RequestKey;
use App\Support\SystemActor;
use App\Values\TrustedEntryAuthority;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

final class EngineAssignmentTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

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
        $this->app->make(CurrentActorSetter::class)->set(new SystemActor(), new TrustedEntryAuthority('engine pass'));
    }
}
