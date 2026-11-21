<?php

declare(strict_types=1);

namespace Tests\Feature\Domains;

use App\Agents\Events\MergeOutcomeRecorded;
use App\Agents\Events\SessionClosed;
use App\Agents\Events\SessionOpened;
use App\Bus\Support\RequiredListenerRegistry;
use App\CoreApi;
use App\Domains\Exceptions\InvalidListener;
use App\Domains\Providers\DomainEventServiceProvider;
use App\Domains\Registration\ListenerPolicy;
use App\Domains\Support\AvailableListener;
use App\Domains\Support\DomainRegistry;
use App\Domains\Support\ListenerOwnership;
use App\Links\Events\LinksRemoved;
use App\Pipelines\Contracts\PipelineRunner;
use App\Processes\Events\OutputChunkCommitted;
use App\Profiles\Events\SignInAttemptFinished;
use App\Profiles\Listeners\ReleaseSignInWriter;
use App\Reflection\Support\CatalogueReflectorFactory;
use App\Web\Listeners\BroadcastPageChange;
use Domain\Plans\Api\Events\PlanProgressChanged;
use Domain\Plans\Api\Events\PlanStarted;
use Domain\Plans\Listeners\CountPhaseTaskStates;
use Domain\Plans\Listeners\SamplePlanOfStartedTask;
use Domain\Sequences\Events\SequenceStarted;
use Domain\Tasks\Api\Events\TaskBlocked;
use Domain\Tasks\Api\Events\TaskCancelled;
use Domain\Tasks\Api\Events\TaskFinished;
use Domain\Tasks\Events\TaskStarted;
use Domain\Tasks\Listeners\AnnounceTaskStart;
use Domain\Tasks\Listeners\PushTaskState;
use Illuminate\Contracts\Queue\ShouldQueue;
use Tests\Fixtures\Boundary\Events\Chat\ChatDomain;
use Tests\Fixtures\Boundary\Events\Plans\Listeners\RequiredClaimListener;
use Tests\Fixtures\Boundary\Events\Plans\Listeners\RequiredCloseListener;
use Tests\Fixtures\Boundary\Events\Plans\PlansDomain;
use Tests\Fixtures\Boundary\Events\Tasks\Events\TaskClaimed;
use Tests\Fixtures\Boundary\Events\Tasks\Events\TaskClosed;
use Tests\Fixtures\Boundary\Events\Tasks\TasksDomain;
use Tests\Fixtures\Listeners\QueuedRequiredListener;
use Tests\Fixtures\Listeners\RequiredProgressListener;
use Tests\TestCase;

/**
 * A listener marked InCommandTransaction leaves the dispatcher's map for the required registry, from the discovered
 * map and the cached one alike; a required listener that defers its work, repeats, or belongs to a domain the event's
 * owner did not declare stops the boot naming the pair, and the ordinary listeners stay as they were.
 */
final class RequiredListenerLaneTest extends TestCase
{
    public function test_a_required_listener_is_in_the_required_lane_and_not_the_dispatchers_from_both_maps(): void
    {
        $policy = $this->policyFor($this->app->make(DomainRegistry::class));
        $required = RequiredProgressListener::class.'@handle';
        $ordinary = BroadcastPageChange::class.'@handle';
        $events = [PlanProgressChanged::class => [$required, $ordinary]];

        $discovered = $policy->registerDiscovered($events);
        $cached = $policy->registerCached($policy->discover($events));

        foreach ([$discovered, $cached] as $gated) {
            $this->assertSame([PlanProgressChanged::class => [$ordinary]], $gated->events);
            $this->assertSame([PlanProgressChanged::class => [$required]], $gated->required);
        }
    }

    public function test_the_application_requires_only_the_listeners_plan_40_moved_so_far(): void
    {
        $registry = $this->app->make(RequiredListenerRegistry::class);

        $this->assertEqualsCanonicalizing(
            [
                TaskStarted::class,
                TaskFinished::class,
                TaskBlocked::class,
                TaskCancelled::class,
                PlanStarted::class,
                SignInAttemptFinished::class,
                SequenceStarted::class,
                LinksRemoved::class,
                SessionOpened::class,
                SessionClosed::class,
                MergeOutcomeRecorded::class,
                OutputChunkCommitted::class,
            ],
            $registry->events(),
        );
        $this->assertSame(
            [
                CountPhaseTaskStates::class,
                SamplePlanOfStartedTask::class,
                AnnounceTaskStart::class,
                PushTaskState::class,
            ],
            array_map(
                fn (mixed $listener) => explode('@', $listener instanceof AvailableListener ? $listener->listener : '')[0],
                $registry->listenersOf(TaskStarted::class),
            ),
        );
        $this->assertSame([ReleaseSignInWriter::class.'@handle'], $registry->listenersOf(SignInAttemptFinished::class));
        $public = new DomainEventServiceProvider($this->app)->getEvents()[SignInAttemptFinished::class] ?? [];
        $this->assertNotContains(ReleaseSignInWriter::class.'@handle', $public);
    }

    public function test_a_queued_required_listener_is_refused(): void
    {
        $policy = $this->policyFor($this->app->make(DomainRegistry::class));
        $listener = QueuedRequiredListener::class.'@handle';

        $this->expectExceptionObject(
            InvalidListener::requiredButDeferred($listener, PlanProgressChanged::class, ShouldQueue::class),
        );

        $policy->registerDiscovered([PlanProgressChanged::class => [$listener]]);
    }

    public function test_a_required_pair_registered_twice_is_refused(): void
    {
        $policy = $this->policyFor($this->app->make(DomainRegistry::class));
        $listener = RequiredProgressListener::class.'@handle';

        $this->expectExceptionObject(InvalidListener::requiredTwice($listener, PlanProgressChanged::class));

        $policy->registerCached([PlanProgressChanged::class => [$listener, $listener]]);
    }

    public function test_an_optional_domains_required_listener_needs_the_write_owners_declaration(): void
    {
        $policy = $this->policyFor(DomainRegistry::from([TasksDomain::class, ChatDomain::class, PlansDomain::class]));
        $declared = RequiredClaimListener::class.'@handle';
        $undeclared = RequiredCloseListener::class.'@handle';

        $gated = $policy->registerDiscovered([TaskClaimed::class => [$declared]]);

        $this->assertEquals([TaskClaimed::class => [new AvailableListener('Plans', $declared)]], $gated->required);
        $this->expectExceptionObject(
            InvalidListener::requiredWithoutDeclaration($undeclared, TaskClosed::class, 'Plans'),
        );

        $policy->registerDiscovered([TaskClosed::class => [$undeclared]]);
    }

    private function policyFor(DomainRegistry $registry): ListenerPolicy
    {
        return new ListenerPolicy(
            $this->app->make(PipelineRunner::class),
            new ListenerOwnership($registry, CoreApi::exports(), [...CoreApi::listenerFolders(), base_path('tests/Fixtures/Listeners')], new CatalogueReflectorFactory()),
        );
    }
}
