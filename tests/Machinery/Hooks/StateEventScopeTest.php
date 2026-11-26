<?php

declare(strict_types=1);

namespace Tests\Machinery\Hooks;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Admission\StackAdmission;
use App\Support\Delivery\StateEventBridge;
use App\Support\EngineAccess;
use App\Support\OperationDeadline;
use App\Support\StateEvents\StateEventScope;
use App\Support\SystemActor;
use App\Values\FrameGrant;
use App\Values\TrustedEntryAuthority;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Events\Dispatcher;
use Tests\Fixtures\Hooks\AfterCommitStateEvent;
use Tests\Fixtures\Modules\Notes\Events\NoteWritten;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\Exceptions\SimulatedFailure;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\TestCase;

#[TestsMachinery(StateEventScope::class)]
final class StateEventScopeTest extends TestCase
{
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->placeBareAgentsInLocalProject();
    }

    public function test_the_same_object_dispatched_twice_carries_distinct_occurrences_through_outer_commit(): void
    {
        $original = TestActors::stack(1, 10);
        $surrounding = TestActors::stack(2, 20);
        $this->journal->actAsAgentId($original->agentId);
        $dispatcher = $this->app->make(Dispatcher::class);
        $scope = $this->app->make(StateEventScope::class);
        $database = $this->app->make(ConnectionInterface::class);
        $event = new AfterCommitStateEvent($surrounding);
        $seen = [];
        $dispatcher->listen(AfterCommitStateEvent::class, StateEventBridge::LISTENER);
        $dispatcher->listen(AfterCommitStateEvent::class, function (AfterCommitStateEvent $received) use (
            $event,
            $scope,
            &$seen,
        ): void {
            $this->assertSame($event, $received);
            $this->assertSame(1, func_num_args());
            $seen[] = $scope->currentDispatch()->get();
        });

        $database->beginTransaction();
        $scope->admit([$original], function () use ($dispatcher, $event): void {
            $dispatcher->dispatch($event);
            $dispatcher->dispatch($event);
        });

        $this->assertSame([], $seen);
        $this->journal->actAsAgentId($surrounding->agentId);
        $scope->admit([$surrounding], fn () => $database->commit());

        $this->assertCount(2, $seen);
        $this->assertNotSame($seen[0]->id, $seen[1]->id);

        foreach ($seen as $dispatch) {
            $audience = $dispatch->audience->get();
            $this->assertSame([$original], $audience->targets);
            $this->assertSame($original->agentId, $audience->actor->actorId());
        }

        $this->assertTrue($scope->currentDispatch()->isEmpty());
    }

    public function test_a_rollback_drops_deferred_delivery_and_a_plain_dispatch_still_reaches_listeners(): void
    {
        $target = TestActors::stack(1, 10);
        $this->journal->actAsAgentId($target->agentId);
        $dispatcher = $this->app->make(Dispatcher::class);
        $scope = $this->app->make(StateEventScope::class);
        $database = $this->app->make(ConnectionInterface::class);
        $seen = [];
        $dispatcher->listen(AfterCommitStateEvent::class, StateEventBridge::LISTENER);
        $dispatcher->listen(AfterCommitStateEvent::class, function () use ($scope, &$seen): void {
            $seen[] = $scope->currentDispatch()->get();
        });

        $database->beginTransaction();
        $event = new AfterCommitStateEvent($target);
        $scope->admit([$target], fn () => $dispatcher->dispatch($event));
        $database->rollBack();
        $this->assertSame([], $seen);

        $dispatcher->dispatch($event);

        $this->assertCount(1, $seen);
        $this->assertTrue($seen[0]->audience->isEmpty());
        $this->assertTrue($scope->currentDispatch()->isEmpty());
    }

    public function test_engine_admission_captures_only_its_frame_grant_and_maintenance_has_no_target(): void
    {
        $access = $this->app->make(EngineAccess::class);
        $this->app->make(CurrentActorSetter::class)->set(new SystemActor(), new TrustedEntryAuthority('engine tick'));
        $admission = $this->app->make(StackAdmission::class);
        $scope = $this->app->make(StateEventScope::class);
        $dispatcher = $this->app->make(Dispatcher::class);
        $seen = [];
        $dispatcher->listen(NoteWritten::class, StateEventBridge::LISTENER);
        $dispatcher->listen(NoteWritten::class, function () use ($scope, &$seen): void {
            $seen[] = $scope->currentDispatch()->get();
        });
        $target = TestActors::stack(1, 10);
        $dispatch = fn () => $dispatcher->dispatch(new NoteWritten());

        $access->grantFrame($target, 'frame-id');
        $admission->admitCaller(new OperationDeadline(), $dispatch);
        $access->grantMaintenance('test');
        $admission->admitCaller(new OperationDeadline(), $dispatch);

        $this->assertCount(2, $seen);
        $this->assertSame([$target], $seen[0]->audience->get()->targets);
        $this->assertTrue($seen[1]->audience->isEmpty());
        $this->assertTrue($scope->currentDispatch()->isEmpty());
    }

    public function test_a_failing_nested_frame_grant_restores_the_surrounding_grant(): void
    {
        $access = $this->app->make(EngineAccess::class);
        $target = TestActors::stack(1, 10);

        $access->withinMaintenance('outer', function () use ($access, $target): void {
            try {
                $access->withinFrameGrant(new FrameGrant($target, 'frame'), function () use ($access, $target): void {
                    $access->assertTargetGranted($target);

                    throw SimulatedFailure::of('The frame operation failed.');
                });
            } catch (SimulatedFailure) {
                $this->assertTrue($access->allowsMaintenance('outer'));
                $this->assertTrue($access->frameGrantFor(new SystemActor())->isEmpty());
            }
        });

        $this->assertFalse($access->allowsMaintenance('outer'));
    }
}
