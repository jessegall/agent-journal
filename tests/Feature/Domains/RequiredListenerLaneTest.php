<?php

declare(strict_types=1);

namespace Tests\Feature\Domains;

use App\Contracts\PipelineRunner;
use App\CoreApi;
use App\Events\AskClosed;
use App\Events\AskHopAssigned;
use App\Events\ChatMessageAccepted;
use App\Events\LinksRemoved;
use App\Events\MergeOutcomeRecorded;
use App\Events\MessageAnswerRequired;
use App\Events\MessageSent;
use App\Events\OutputChunkCommitted;
use App\Events\ProcessRunOutlasted;
use App\Events\RunOutcomeRecorded;
use App\Events\SessionClosed;
use App\Events\SessionOpened;
use App\Events\SignInAttemptFinished;
use App\Exceptions\InvalidListener;
use App\Listeners\BroadcastPageChange;
use App\Listeners\ReleaseSignInWriter;
use App\Providers\DomainEventServiceProvider;
use App\Support\AvailableListener;
use App\Support\CatalogueReflectorFactory;
use App\Support\DomainRegistry;
use App\Support\ListenerOwnership;
use App\Support\Registration\ListenerPolicy;
use App\Support\RequiredListenerRegistry;
use Domain\Documents\Events\ReportFiled;
use Domain\Helpers\Events\ReportJobLinked;
use Domain\Plans\Events\PlanProgressChanged;
use Domain\Plans\Events\PlanReviewRequested;
use Domain\Plans\Events\PlanStarted;
use Domain\Plans\Listeners\CountPhaseTaskStates;
use Domain\Plans\Listeners\SamplePlanOfStartedTask;
use Domain\Sequences\Events\SequenceEnded;
use Domain\Sequences\Events\SequenceStarted;
use Domain\Sequences\Events\SequenceStepEnded;
use Domain\Sequences\Events\SequenceStepReached;
use Domain\Tasks\Events\TaskBlocked;
use Domain\Tasks\Events\TaskCancelled;
use Domain\Tasks\Events\TaskDescribed;
use Domain\Tasks\Events\TaskFinished;
use Domain\Tasks\Events\TaskStarted;
use Domain\Tasks\Listeners\AnnounceTaskStart;
use Domain\Tasks\Listeners\PushTaskState;
use Domain\Tasks\Listeners\RecordTaskHistory;
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
                MessageAnswerRequired::class,
                MessageSent::class,
                ChatMessageAccepted::class,
                PlanReviewRequested::class,
                TaskDescribed::class,
                RunOutcomeRecorded::class,
                AskClosed::class,
                AskHopAssigned::class,
                ReportFiled::class,
                ReportJobLinked::class,
                ProcessRunOutlasted::class,
                SequenceEnded::class,
                SequenceStepEnded::class,
                SequenceStepReached::class,
            ],
            $registry->events(),
        );
        $this->assertSame(
            [
                CountPhaseTaskStates::class,
                SamplePlanOfStartedTask::class,
                AnnounceTaskStart::class,
                PushTaskState::class,
                RecordTaskHistory::class,
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
            new ListenerOwnership($registry, CoreApi::exports(), [...CoreApi::listenerFolders(), base_path('tests/Fixtures/Listeners')], new CatalogueReflectorFactory(), app_path()),
        );
    }
}
