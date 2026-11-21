<?php

declare(strict_types=1);

namespace Tests\Feature\Events;

use App\Hooks\StateEvents\StateEventBridge;
use App\Hooks\StateEvents\StateEventScope;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Events\Dispatcher;
use Tests\Fixtures\Hooks\AfterCommitStateEvent;
use Tests\Support\ActsAsActors;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * The state bridge's place in the order plan 40 must keep (doc 67 section 19, the state bridge row): two stack
 * siblings each send an after-commit event in one transaction, and after the commit each event reaches its ordinary
 * listener first and the bridge last, with the audience its own sibling admitted.
 */
final class StateBridgeTimelineTest extends TestCase
{
    use ActsAsActors;
    use RefreshHookDatabase;

    public function test_after_the_commit_each_siblings_event_reaches_the_bridge_last_with_its_own_audience(): void
    {
        $first = TestActors::stack(1, 10);
        $second = TestActors::stack(2, 20);
        $dispatcher = $this->app->make(Dispatcher::class);
        $scope = $this->app->make(StateEventScope::class);
        $database = $this->app->make(ConnectionInterface::class);
        $timeline = [];
        $dispatcher->listen(AfterCommitStateEvent::class, StateEventBridge::LISTENER);
        $dispatcher->listen(AfterCommitStateEvent::class, function () use ($scope, &$timeline): void {
            $targets = $scope->currentDispatch()->get()->audience->get()->targets;
            $timeline[] = 'listener for '.$targets[0]->sessionId;
        });
        $targets = [$first, $second];
        $dispatcher->listen(QueryExecuted::class, function (QueryExecuted $query) use ($targets, &$timeline): void {
            foreach ($targets as $target) {
                $readsTarget = in_array($target->sessionId, $query->bindings, true);

                if ($readsTarget && end($timeline) !== "bridge for {$target->sessionId}") {
                    $timeline[] = "bridge for {$target->sessionId}";
                }
            }
        });

        $database->beginTransaction();
        $this->actAsAgent($first->agentId);
        $scope->admit([$first], fn () => $dispatcher->dispatch(new AfterCommitStateEvent($first)));
        $this->actAsAgent($second->agentId);
        $scope->admit([$second], fn () => $dispatcher->dispatch(new AfterCommitStateEvent($second)));
        $timeline[] = 'commit';
        $database->commit();

        $this->assertSame([
            'commit',
            "listener for {$first->sessionId}",
            "bridge for {$first->sessionId}",
            "listener for {$second->sessionId}",
            "bridge for {$second->sessionId}",
        ], $timeline);
    }
}
