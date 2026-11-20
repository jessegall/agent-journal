<?php

declare(strict_types=1);

namespace Tests\Feature\Assignments;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorIdentity;
use App\Actors\Values\TrustedEntryAuthority;
use App\Assignments\Commands\AssignRecordForMaintenance;
use App\Assignments\Commands\ClaimAutoAssignment;
use App\Assignments\Contracts\AssignedWorkResolver;
use App\Assignments\Contracts\AssignmentProviders;
use App\Assignments\Contracts\AutoAssignmentActivity;
use App\Assignments\Contracts\AutoAssignmentResolver;
use App\Assignments\Contracts\AutoAssignmentTrigger;
use App\Assignments\Exceptions\AssignmentConflict;
use App\Assignments\Support\AutoAssignmentBudget;
use App\Assignments\Support\AutoAssignmentFact;
use App\Assignments\Support\AutoAssignmentKey;
use App\Assignments\Support\AutoAssignmentOutcome;
use App\Assignments\Support\AutoAssignmentPage;
use App\Assignments\Support\AutoAssignmentRun;
use App\Assignments\Support\Page;
use App\Assignments\Support\PoolReference;
use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\StopTime;
use App\Bus\Contracts\StopTimes;
use App\Contracts\DomainAvailability;
use App\Engine\Support\EngineAccess;
use App\Engine\Support\EngineActor;
use Carbon\CarbonImmutable;
use Domain\Tasks\Assignments\TaskAssigner;
use Psr\Log\LoggerInterface;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\TestCase;

final class AutoAssignmentTriggerTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        $this->app->make(CurrentActorSetter::class)->set(new EngineActor(), new TrustedEntryAuthority('engine pass'));
        $this->app->make(EngineAccess::class)->grantMaintenance(AssignRecordForMaintenance::FILL_SCOPE);
        $stop = $this->createStub(StopTime::class);
        $stop->method('remainingMilliseconds')->willReturn(100);
        $this->mock(StopTimes::class)->shouldReceive('at')->andReturn($stop);
        $this->mock(DomainAvailability::class)->shouldReceive('isEnabled')->with('Tasks')->andReturn(true);
        $activity = $this->createStub(AutoAssignmentActivity::class);
        $activity->method('mayTakeWork')->willReturnCallback(
            fn (ActorIdentity $actor): bool => $actor->id !== TestIds::of(25),
        );
        $providers = $this->mock(AssignmentProviders::class);
        $providers->shouldReceive('recordOwner', 'poolOwner')->andReturn('Tasks');
        $providers->shouldReceive('activity')->andReturn($activity);
        $providers->shouldReceive('autoAssignerClass')->andReturn(TaskAssigner::class);
    }

    public function test_consider_walks_one_page_caps_claims_and_advances_on_the_last_page(): void
    {
        $assignments = $this->mock(AutoAssignmentResolver::class);
        $assignments->shouldReceive('enabled')->once()->withArgs(
            fn (Page $page): bool => $page->limit === 20 && $page->afterId === null,
        )->andReturn(new AutoAssignmentPage(array_map($this->fact(...), range(1, 20)), TestIds::of(20)));
        $assignments->shouldReceive('enabled')->once()->withArgs(
            fn (Page $page): bool => $page->limit === 20 && $page->afterId === TestIds::of(20),
        )->andReturn(new AutoAssignmentPage(array_map($this->fact(...), range(21, 25)), null));
        $assignments->shouldReceive('enabled')->once()->withArgs(
            fn (Page $page): bool => $page->afterId === TestIds::of(25),
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
            fn (ClaimAutoAssignment $claim): bool => $claim->key->isOf(TestActors::agentIdentity(2)),
        )->andThrow(AssignmentConflict::heldByAnother($record));
        $bus->shouldReceive('run')->once()->ordered()->withArgs(
            fn (ClaimAutoAssignment $claim): bool => $claim->key->isOf(TestActors::agentIdentity(1)),
        )->andReturn(AutoAssignmentOutcome::assigned($record));
        $this->mock(LoggerInterface::class)->shouldReceive('warning')->once()->withArgs(
            fn (string $message, array $fields): bool => $message === 'Auto-assignment claim failed.'
                && $fields['actor_id'] === TestIds::of(2) && $fields['provider'] === TaskAssigner::class,
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
