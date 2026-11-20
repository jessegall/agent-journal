<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Values\TrustedEntryAuthority;
use App\Agents\Models\Agent;
use App\Assignments\Commands\AssignRecordForMaintenance;
use App\Assignments\Commands\ReassignRecord;
use App\Assignments\Commands\UnassignRecord;
use App\Assignments\Models\AssignmentRecord;
use App\Bus\Contracts\CommandBus;
use App\Bus\Enums\CommandEntry;
use App\Bus\Exceptions\CommandNotRegistered;
use App\Bus\Support\CommandEntrance;
use App\Bus\Support\RequestKey;
use App\Engine\Exceptions\EngineAccessRefused;
use App\Engine\Support\EngineAccess;
use App\Engine\Support\EngineActor;
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
        $this->app->make(EngineAccess::class)->grantMaintenance(AssignRecordForMaintenance::FILL_SCOPE);
        $this->app->make(RequestKey::class)->set('engine-fill');
        $bus = $this->app->make(CommandBus::class);
        $this->assertThrows(
            fn () => $bus->run(new AssignRecordForMaintenance($record, $holder)),
            CommandNotRegistered::class,
        );

        $this->app->make(CommandEntrance::class)->through(CommandEntry::EngineMaintenance, function () use (
            $bus,
            $record,
            $holder,
        ): void {
            $result = $bus->run(new AssignRecordForMaintenance($record, $holder));
            $assignment = $result->outcomes[0]->current;
            $this->assertNotNull($assignment);
            $this->assertTrue($assignment->holder()->isSameAs($holder));
            $this->assertThrows(
                fn () => $bus->run(new ReassignRecord($record, $assignment->reference, $holder)),
                CommandNotRegistered::class,
            );
            $this->assertThrows(
                fn () => $bus->run(new UnassignRecord($record, $assignment->reference)),
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
            fn () => $bus->run(new AssignRecordForMaintenance($record, $holder)),
        );
        $this->app->make(RequestKey::class)->set('missing-scope');
        $this->assertThrows($assign, EngineAccessRefused::class);
        $this->app->make(EngineAccess::class)->grantMaintenance('another.scope');
        $this->app->make(RequestKey::class)->set('different-scope');
        $this->assertThrows($assign, EngineAccessRefused::class, AssignRecordForMaintenance::FILL_SCOPE);
        $this->assertFalse(AssignmentRecord::query()->forRecord($record)->exists());
    }

    private function actAsEngine(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(new EngineActor(), new TrustedEntryAuthority('engine pass'));
    }
}
