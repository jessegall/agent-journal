<?php

declare(strict_types=1);

namespace Tests\Machinery\Hooks;

use App\Access\StateEvents\StateEventScope;
use App\Bus\EventUnitLifecycle;
use App\Bus\ListenerRegistry;
use App\Support\Delivery\StateEventBridge;
use App\Support\StackTransaction;
use App\Values\StackTarget;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Schema;
use Tests\Fixtures\Contracts\RaisingRow;
use Tests\Fixtures\Contracts\RowRenamed;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * A bridged fact raised inside a stack sibling's admission keeps that sibling's audience until it is released after
 * the single commit; a fact raised with no admission has none, and a rollback reaches no listener.
 */
#[TestsMachinery(StateEventBridge::class)]
final class StateBridgeReleaseTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [];

    /**
     * @var list<string>
     */
    private array $heard = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->placeBareAgentsInLocalProject();

        Schema::dropIfExists('raising_rows');
        Schema::create('raising_rows', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });
        $this->app->instance(ListenerRegistry::class, new ListenerRegistry());
        $scope = $this->app->make(StateEventScope::class);
        $dispatcher = $this->app->make(Dispatcher::class);
        $dispatcher->listen(RowRenamed::class, StateEventBridge::LISTENER);
        $dispatcher->listen(RowRenamed::class, function (RowRenamed $renamed) use ($scope): void {
            $audience = $scope->currentDispatch()->get()->audience;
            $target = $audience->isEmpty() ? 'no audience' : $audience->get()->targets[0]->sessionId;
            $this->heard[] = "{$renamed->name} for {$target}";
        });
    }

    protected function tearDown(): void
    {
        Schema::dropIfExists('raising_rows');

        parent::tearDown();
    }

    public function test_each_siblings_fact_reaches_its_own_audience_after_the_single_commit(): void
    {
        [$first, $second] = [TestActors::stack(1, 10), TestActors::stack(2, 20)];
        [$firstRow, $secondRow] = [$this->row(), $this->row()];
        $heardBeforeCommit = [];

        $siblings = function () use ($first, $second, $firstRow, $secondRow, &$heardBeforeCommit): void {
            $this->renameAs($first, $firstRow, 'first');
            $this->renameAs($second, $secondRow, 'second');
            $heardBeforeCommit = $this->heard;
        };

        $this->app->make(StackTransaction::class)->run($siblings);

        $this->assertSame([], $heardBeforeCommit);
        $this->assertSame(["first for {$first->sessionId}", "second for {$second->sessionId}"], $this->heard);
    }

    private function renameAs(StackTarget $target, RaisingRow $row, string $name): void
    {
        $this->journal->actAsAgentId($target->agentId);
        $scope = $this->app->make(StateEventScope::class);
        $scope->admit([$target], fn () => $this->within(fn () => $row->rename($name)));
    }

    private function within(callable $work): void
    {
        $database = $this->app->make(ConnectionInterface::class);
        $this->app->make(EventUnitLifecycle::class)->within($database, $work(...));
    }

    private function row(): RaisingRow
    {
        $raisingRow = new RaisingRow();
        $raisingRow->name = 'start';
        $raisingRow->save();

        return $raisingRow;
    }
}
