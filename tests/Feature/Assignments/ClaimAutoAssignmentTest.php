<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Commands\AssignRecordForMaintenance\AssignRecordForMaintenanceCommand;
use App\Commands\ClaimAutoAssignment\ClaimAutoAssignmentCommand;
use App\Commands\EnableAutoAssignment\EnableAutoAssignmentCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Assignments\AutoAssignmentResolver;
use App\Contracts\Assignments\MaintenanceAssignmentWriter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Domains\DomainAvailability;
use App\Enums\AutoAssignmentClaimType;
use App\Enums\CommandEntry;
use App\Exceptions\AssignmentConflict;
use App\Exceptions\EngineAccessRefused;
use App\Models\Agents\Agent;
use App\Models\Records\AssignmentRecord;
use App\Support\ActorIdentity;
use App\Support\AutoAssignmentFact;
use App\Support\AutoAssignmentInput;
use App\Support\AutoAssignmentKey;
use App\Support\AutoAssignmentOutcome;
use App\Support\CommandEntrance;
use App\Support\EngineAccess;
use App\Support\EngineActor;
use App\Support\PoolReference;
use App\Values\TrustedEntryAuthority;
use Domain\Tasks\Models\Task;
use Tests\Support\CommitsHookRows;
use Tests\Support\HasAutoAssignmentWorker;
use Tests\TestCase;

final class ClaimAutoAssignmentTest extends TestCase
{
    use CommitsHookRows;
    use HasAutoAssignmentWorker;

    private const array TABLES = [
        'assignments', 'auto_assignments', 'command_receipts',
        'tasks', 'agents', 'agent_sessions', 'start_tokens', 'users',
    ];

    public function test_a_claim_fills_one_slot_and_later_claims_leave_the_full_fact_unchanged(): void
    {
        Task::factory()->count(2)->create();
        $this->enable($this->key);
        $first = $this->claim($this->key);
        $served = $this->fact()->lastServedAt;

        $this->assertSame(AutoAssignmentClaimType::Assigned, $first->type);
        $this->assertNotNull($first->record);
        $this->assertNotNull($served);
        $this->assertSame(AutoAssignmentClaimType::Full, $this->claim($this->key)->type);
        $this->assertEquals($served, $this->fact()->lastServedAt);
        $this->assertSame(1, AssignmentRecord::query()->forRecord($first->record)->count());
        $this->assertSame(1, $this->fact()->revision);
    }

    public function test_off_inactive_and_disabled_domains_do_not_assign(): void
    {
        $this->assertSame(AutoAssignmentClaimType::Off, $this->claim($this->key)->type);
        $this->startUserRequestAs($this->owner->id);
        $inactive = ActorIdentity::of(Agent::create('Inactive', 'writing-helper'));
        $key = new AutoAssignmentKey($inactive, $this->key->assignableType);
        $this->enable($key);
        $this->enable($this->key);
        Task::factory()->create();

        $this->assertSame(AutoAssignmentClaimType::Unavailable, $this->claim($key)->type);
        $domains = $this->mock(DomainAvailability::class);
        $domains->shouldReceive('isEnabled')->with('Tasks')->once()->andReturn(false);
        $this->assertSame(AutoAssignmentClaimType::Unavailable, $this->claim($this->key)->type);
        $this->assertNull($this->fact()->lastServedAt);
    }

    public function test_a_nested_assignment_conflict_does_not_mark_the_fact_served(): void
    {
        $record = Task::factory()->create()->assignmentIdentity();
        $this->enable($this->key);
        $this->mock(MaintenanceAssignmentWriter::class)->shouldReceive('assignForMaintenance')->once()->andThrow(
            AssignmentConflict::heldByAnother($record),
        );

        $this->assertThrows(fn () => $this->claim($this->key), AssignmentConflict::class);
        $this->assertNull($this->fact()->lastServedAt);
        $this->assertSame(1, $this->fact()->revision);
    }

    public function test_the_claim_requires_its_maintenance_capability(): void
    {
        $this->assertThrows(
            fn () => $this->claim($this->key, 'different.scope'),
            EngineAccessRefused::class,
            AssignRecordForMaintenanceCommand::FILL_SCOPE,
        );
    }

    private function enable(AutoAssignmentKey $key): void
    {
        $input = new AutoAssignmentInput($key, new PoolReference('tasks.open', null, []), 1);
        $this->app->make(CommandBus::class)->run(new EnableAutoAssignmentCommand($input, 0));
    }

    private function claim(
        AutoAssignmentKey $key,
        string $scope = AssignRecordForMaintenanceCommand::FILL_SCOPE,
    ): AutoAssignmentOutcome {
        $this->app->make(CurrentActorSetter::class)->set(new EngineActor(), new TrustedEntryAuthority('engine pass'));
        $access = $this->app->make(EngineAccess::class);

        return $access->withinMaintenance($scope, fn () => $this->app->make(CommandEntrance::class)->through(
            CommandEntry::EngineMaintenance,
            fn () => $this->app->make(CommandBus::class)->run(new ClaimAutoAssignmentCommand($key)),
        ));
    }

    private function fact(): AutoAssignmentFact
    {
        return $this->app->make(AutoAssignmentResolver::class)->forActor($this->key)->get();
    }
}
