<?php

declare(strict_types=1);

namespace Tests\Unit\Domains;

use App\Bootstrap\CoreListenerFolders;
use App\Bus\AvailableListener;
use App\Bus\Contracts\PipelineRunner;
use App\Bus\Exceptions\InvalidListener;
use App\Bus\ListenerOwnership;
use App\Bus\ListenerRegistry;
use App\Engine\Enums\ListenerLane;
use App\Events\Accounts\SignInAttemptFinished;
use App\Events\Connections\HostInstructionRefused;
use App\Events\Connections\HostProcessExited;
use App\Events\Connections\HostProcessLost;
use App\Events\Connections\HostProcessRestarted;
use App\Events\Links\LinksRemoved;
use App\Events\Messages\MessageSent;
use App\Events\Processes\OutputChunkCommitted;
use App\Events\Processes\RunOutcomeRecorded;
use App\Events\Sessions\AgentSessionEnded;
use App\Events\Sessions\SessionClosed;
use App\Events\Sessions\SessionOpened;
use App\Listeners\BroadcastPageChange;
use App\Listeners\ReleaseSignInWriter;
use App\Providers\DomainEventServiceProvider;
use App\Reflection\CatalogueReflectorFactory;
use App\Support\DomainRegistry;
use App\Support\Registration\ListenerPolicy;
use Domain\Plans\Events\PlanProgressChanged;
use Domain\Plans\Events\PlanReviewRequested;
use Domain\Plans\Events\PlanStarted;
use Domain\Plans\Listeners\CountPhaseTaskStates;
use Domain\Questions\Events\QuestionAnswered;
use Domain\Questions\Events\QuestionAsked;
use Domain\Sequences\Events\SequenceStarted;
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
use Tests\Fixtures\Boundary\Events\Plans\Listeners\TransactionClaimListener;
use Tests\Fixtures\Boundary\Events\Plans\Listeners\TransactionCloseListener;
use Tests\Fixtures\Boundary\Events\Plans\PlansDomain;
use Tests\Fixtures\Boundary\Events\Tasks\Events\TaskClaimed;
use Tests\Fixtures\Boundary\Events\Tasks\Events\TaskClosed;
use Tests\Fixtures\Boundary\Events\Tasks\TasksDomain;
use Tests\Fixtures\Listeners\QueuedTransactionListener;
use Tests\Fixtures\Listeners\TransactionProgressListener;
use Tests\TestCase;

/**
 * A listener marked InCommandTransaction leaves the dispatcher's map for the required registry, from the discovered
 * map and the cached one alike; a transaction listener that defers its work, repeats, or belongs to a domain the event's
 * owner did not declare stops the boot naming the pair, and the ordinary listeners stay as they were.
 */
final class TransactionListenerLaneTest extends TestCase
{
    /**
     * Every installed domain, since the lane lists the transaction listeners of them all.
     */
    protected static function bootedDomains(): array
    {
        return DomainRegistry::installedClasses(dirname(__DIR__, 3));
    }

    public function test_a_transaction_listener_is_in_the_transaction_lane_and_not_the_dispatchers_from_both_maps(): void
    {
        $policy = $this->policyFor($this->app->make(DomainRegistry::class));
        $inTransaction = TransactionProgressListener::class.'@handle';
        $ordinary = BroadcastPageChange::class.'@handle';
        $events = [PlanProgressChanged::class => [$inTransaction, $ordinary]];

        $discovered = $policy->registerDiscovered($events);
        $cached = $policy->registerCached($policy->discover($events));

        foreach ([$discovered, $cached] as $registry) {
            $this->assertSame([PlanProgressChanged::class => [$ordinary]], $registry->byEvent(ListenerLane::AfterCommit));
            $this->assertSame(
                [PlanProgressChanged::class => [$inTransaction]],
                $registry->byEvent(ListenerLane::InCommandTransaction),
            );
        }
    }

    public function test_the_transaction_lane_holds_only_the_listeners_plan_40_moved_so_far(): void
    {
        $registry = $this->app->make(ListenerRegistry::class);

        $this->assertEqualsCanonicalizing(
            [
                TaskStarted::class,
                TaskFinished::class,
                TaskBlocked::class,
                TaskCancelled::class,
                PlanStarted::class,
                SignInAttemptFinished::class,
                HostInstructionRefused::class,
                HostProcessExited::class,
                HostProcessLost::class,
                HostProcessRestarted::class,
                SequenceStarted::class,
                QuestionAnswered::class,
                QuestionAsked::class,
                LinksRemoved::class,
                SessionOpened::class,
                SessionClosed::class,
                AgentSessionEnded::class,
                OutputChunkCommitted::class,
                MessageSent::class,
                PlanReviewRequested::class,
                TaskDescribed::class,
                RunOutcomeRecorded::class,
            ],
            array_keys($registry->byEvent(ListenerLane::InCommandTransaction)),
        );
        $this->assertSame(
            [
                CountPhaseTaskStates::class,
                AnnounceTaskStart::class,
                PushTaskState::class,
                RecordTaskHistory::class,
            ],
            array_map(
                fn (mixed $listener) => explode('@', $listener instanceof AvailableListener ? $listener->listener : '')[0],
                $registry->listenersOf(TaskStarted::class, ListenerLane::InCommandTransaction),
            ),
        );
        $this->assertSame([ReleaseSignInWriter::class.'@handle'], $registry->listenersOf(SignInAttemptFinished::class, ListenerLane::InCommandTransaction));
        $public = new DomainEventServiceProvider($this->app)->getEvents()[SignInAttemptFinished::class] ?? [];
        $this->assertNotContains(ReleaseSignInWriter::class.'@handle', $public);
    }

    public function test_a_queued_transaction_listener_is_refused(): void
    {
        $policy = $this->policyFor($this->app->make(DomainRegistry::class));
        $listener = QueuedTransactionListener::class.'@handle';

        $this->expectExceptionObject(
            InvalidListener::deferredInTransaction($listener, PlanProgressChanged::class, ShouldQueue::class),
        );

        $policy->registerDiscovered([PlanProgressChanged::class => [$listener]]);
    }

    public function test_a_required_pair_registered_twice_is_refused(): void
    {
        $policy = $this->policyFor($this->app->make(DomainRegistry::class));
        $listener = TransactionProgressListener::class.'@handle';

        $this->expectExceptionObject(InvalidListener::twiceInTransaction($listener, PlanProgressChanged::class));

        $policy->registerCached([PlanProgressChanged::class => [$listener, $listener]]);
    }

    public function test_an_optional_domains_transaction_listener_needs_the_write_owners_declaration(): void
    {
        $policy = $this->policyFor(DomainRegistry::from([TasksDomain::class, ChatDomain::class, PlansDomain::class]));
        $declared = TransactionClaimListener::class.'@handle';
        $undeclared = TransactionCloseListener::class.'@handle';

        $registry = $policy->registerDiscovered([TaskClaimed::class => [$declared]]);

        $this->assertEquals(
            [TaskClaimed::class => [new AvailableListener('Plans', $declared)]],
            $registry->byEvent(ListenerLane::InCommandTransaction),
        );
        $this->expectExceptionObject(
            InvalidListener::inTransactionWithoutDeclaration($undeclared, TaskClosed::class, 'Plans'),
        );

        $policy->registerDiscovered([TaskClosed::class => [$undeclared]]);
    }

    private function policyFor(DomainRegistry $registry): ListenerPolicy
    {
        return new ListenerPolicy(
            $this->app->make(PipelineRunner::class),
            new ListenerOwnership($registry, [...CoreListenerFolders::all(), base_path('tests/Fixtures/Listeners')], new CatalogueReflectorFactory(), app_path()),
        );
    }
}
