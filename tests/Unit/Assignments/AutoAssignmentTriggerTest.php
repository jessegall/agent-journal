<?php

declare(strict_types=1);

namespace Tests\Unit\Assignments;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\SystemActor;
use App\Assignments\AutoAssignmentBudget;
use App\Assignments\AutoAssignmentOutcome;
use App\Assignments\AutoAssignmentRun;
use App\Assignments\Commands\AssignRecordForMaintenance\AssignRecordForMaintenanceCommand;
use App\Assignments\Commands\ClaimAutoAssignment\ClaimAutoAssignmentCommand;
use App\Assignments\Contracts\AssignedWorkResolver;
use App\Assignments\Contracts\AssignmentProviders;
use App\Assignments\Contracts\AutoAssignmentActivity;
use App\Assignments\Contracts\AutoAssignmentResolver;
use App\Assignments\Contracts\AutoAssignmentTrigger;
use App\Assignments\Exceptions\AssignmentConflict;
use App\Bootstrap\Contracts\Domains\DomainAvailability;
use App\Bus\Contracts\CommandBus;
use App\Engine\EngineAccess;
use App\Processes\Contracts\StopTime;
use App\Processes\Contracts\StopTimes;
use App\Support\ActorReference;
use App\Support\AutoAssignmentFact;
use App\Support\AutoAssignmentKey;
use App\Support\AutoAssignmentPage;
use App\Support\IdListPage;
use App\Support\PoolReference;
use App\Values\TrustedEntryAuthority;
use Carbon\CarbonImmutable;
use Domain\Tasks\Support\Assignments\AutoAssigner;
use Domain\Tasks\TasksDomain;
use Psr\Log\LoggerInterface;
use Tests\Support\DomainBoot;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\TestCase;

final class AutoAssignmentTriggerTest extends TestCase
{
    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->make(CurrentActorSetter::class)->set(new SystemActor(), new TrustedEntryAuthority('engine pass'));
        $this->app->make(EngineAccess::class)->grantMaintenance(AssignRecordForMaintenanceCommand::FILL_SCOPE);
        $stop = $this->createStub(StopTime::class);
        $stop->method('remainingMilliseconds')->willReturn(100);
        $this->mock(StopTimes::class)->shouldReceive('at')->andReturn($stop);
        $this->mock(DomainAvailability::class)->shouldReceive('isEnabled')->with('Tasks')->andReturn(true);
        $activity = $this->createStub(AutoAssignmentActivity::class);
        $activity->method('mayTakeWork')->willReturnCallback(
            fn (ActorReference $actor): bool => $actor->id !== TestIds::of(25),
        );
        $providers = $this->mock(AssignmentProviders::class);
        $providers->shouldReceive('recordOwner', 'poolOwner')->andReturn('Tasks');
        $providers->shouldReceive('activity')->andReturn($activity);
        $providers->shouldReceive('autoAssignerClass')->andReturn(AutoAssigner::class);
    }

    public function test_consider_walks_one_page_caps_claims_and_advances_on_the_last_page(): void
    {
        $assignments = $this->mock(AutoAssignmentResolver::class);
        $assignments->shouldReceive('enabled')->once()->withArgs(
            fn (IdListPage $page): bool => $page->limit === 20 && $page->afterId === null,
        )->andReturn(new AutoAssignmentPage(array_map($this->fact(...), range(1, 20)), TestIds::of(20)));
        $assignments->shouldReceive('enabled')->once()->withArgs(
            fn (IdListPage $page): bool => $page->limit === 20 && $page->afterId === TestIds::of(20),
        )->andReturn(new AutoAssignmentPage(array_map($this->fact(...), range(21, 25)), null));
        $assignments->shouldReceive('enabled')->once()->withArgs(
            fn (IdListPage $page): bool => $page->afterId === TestIds::of(25),
        )->andReturn(new AutoAssignmentPage([], null));
        $this->mock(AssignedWorkResolver::class)->shouldReceive('count')->andReturn(0);
        $this->mock(CommandBus::class)->shouldReceive('run')->times(9)->andReturn(AutoAssignmentOutcome::noCandidate());

        $this->assertEquals(new AutoAssignmentRun(20, 5, 0, 0, TestIds::of(20)), $this->consider());
        $this->assertEquals(new AutoAssignmentRun(5, 4, 0, 0, TestIds::of(25)), $this->consider(TestIds::of(20)));
        $this->assertEquals(new AutoAssignmentRun(0, 0, 0, 0, null), $this->consider(TestIds::of(25)));
    }

    public function test_consider_prefers_never_served_skips_full_and_continues_after_a_failed_claim(): void
    {
        $older = CarbonImmutable::parse('2026-11-19 00:00:00 UTC');
        $this->mock(AutoAssignmentResolver::class)->shouldReceive('enabled')->once()->andReturn(
            new AutoAssignmentPage([$this->fact(1, $older), $this->fact(2), $this->fact(3), $this->fact(25)], null),
        );
        $this->mock(AssignedWorkResolver::class)->shouldReceive('count')->andReturn(0, 0, 1);
        $bus = $this->mock(CommandBus::class);
        $record = TestActors::record('tasks.task', 4);
        $bus->shouldReceive('run')->once()->ordered()->withArgs(
            fn (ClaimAutoAssignmentCommand $claim): bool => $claim->key->isOf(TestActors::agentIdentity(2)),
        )->andThrow(AssignmentConflict::heldByAnother($record));
        $bus->shouldReceive('run')->once()->ordered()->withArgs(
            fn (ClaimAutoAssignmentCommand $claim): bool => $claim->key->isOf(TestActors::agentIdentity(1)),
        )->andReturn(AutoAssignmentOutcome::assigned($record));
        $this->mock(LoggerInterface::class)->shouldReceive('warning')->once()->withArgs(
            fn (string $message, array $fields): bool => $message === 'Auto-assignment claim failed.'
                && $fields['actor_id'] === TestIds::of(2) && $fields['provider'] === AutoAssigner::class,
        );

        $this->assertEquals(new AutoAssignmentRun(4, 2, 1, 1, TestIds::of(25)), $this->consider());
    }

    private function consider(string|null $after = null): AutoAssignmentRun
    {
        return $this->app->make(AutoAssignmentTrigger::class)->consider(new AutoAssignmentBudget(1, 25, 10, $after));
    }

    private function fact(int $number, CarbonImmutable|null $servedAt = null): AutoAssignmentFact
    {
        return new AutoAssignmentFact(
            TestIds::of($number),
            new AutoAssignmentKey(TestActors::agentIdentity($number), 'tasks.task'),
            true,
            new PoolReference('tasks.open', null, []),
            1,
            1,
            $servedAt,
        );
    }
}
