<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Exceptions\EventUnitRefused;
use App\Support\ActiveEventUnits;
use App\Support\EventUnit;
use App\Support\EventUnitLifecycle;
use App\Support\RequiredListenerRegistry;
use App\Support\StackTransaction;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use RuntimeException;
use Tests\Fixtures\Contracts\NotesFirstRename;
use Tests\Fixtures\Contracts\RaisingRow;
use Tests\Fixtures\Contracts\RowNoted;
use Tests\Fixtures\Contracts\RowRenamed;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * The event unit follows the transaction that really commits: an inner command's required work is done before it
 * returns, a failure that crossed a command refuses the commit even when caught, a rolled-back stack keeps no fact
 * and the next one starts empty, and a retried attempt keeps the facts of the attempt that commits only.
 */
final class EventUnitLifecycleTest extends TestCase
{
    use CommitsHookRows;

    private const string INNER_FAILURE = 'inner command failed';

    private const array TABLES = [];

    protected function setUp(): void
    {
        parent::setUp();

        Schema::dropIfExists('raising_rows');
        Schema::create('raising_rows', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });
        $required = [RowRenamed::class => [NotesFirstRename::class.'@handle']];
        $this->app->instance(RequiredListenerRegistry::class, new RequiredListenerRegistry($required));
    }

    protected function tearDown(): void
    {
        Schema::dropIfExists('raising_rows');

        parent::tearDown();
    }

    public function test_an_inner_commands_required_work_is_done_when_it_returns(): void
    {
        $row = RaisingRow::query()->create(['name' => 'start']);
        $seen = [];

        $unit = $this->owned(function () use ($row, &$seen): void {
            $this->within(fn () => $row->rename('first'));
            $seen = $this->activeUnit()->batch();
        });

        $this->assertEquals([new RowRenamed($row->id, 'first'), new RowNoted($row->id)], $seen);
        $this->assertTrue($unit->isReady());
    }

    public function test_a_caught_failure_of_an_inner_command_refuses_the_commit_with_no_facts(): void
    {
        $row = RaisingRow::query()->create(['name' => 'start']);
        $unit = null;
        $caught = '';
        $commit = function () use ($row, &$unit, &$caught): void {
            $this->owned(function () use ($row, &$unit, &$caught): void {
                $unit = $this->activeUnit();
                $row->rename('second');

                try {
                    $this->within(fn () => throw new RuntimeException(self::INNER_FAILURE));
                } catch (RuntimeException $failure) {
                    $caught = $failure->getMessage();
                }
            });
        };

        $this->assertThrows($commit, EventUnitRefused::class);
        $this->assertSame(self::INNER_FAILURE, $caught);
        $this->assertSame([], $unit?->batch());
        $this->assertSame('start', $row->refresh()->name);
    }

    public function test_a_stack_that_throws_after_a_command_rolls_both_back_and_the_next_stack_starts_empty(): void
    {
        $row = RaisingRow::query()->create(['name' => 'start']);
        $stack = $this->app->make(StackTransaction::class);

        $this->assertThrows(fn () => $stack->run(function () use ($row): void {
            $this->within(fn () => $row->rename('second'));

            throw new RuntimeException('the stack failed');
        }), RuntimeException::class);
        $next = $stack->run(fn () => $this->activeUnit()->batch());

        $this->assertSame('start', $row->refresh()->name);
        $this->assertSame([], $row->takeRaisedEvents());
        $this->assertSame([], $next);
    }

    public function test_a_retried_attempt_keeps_only_the_facts_of_the_attempt_that_commits(): void
    {
        $row = RaisingRow::query()->create(['name' => 'start']);

        $this->assertThrows(fn () => $this->owned(function () use ($row): void {
            $row->rename('second');

            throw new RuntimeException('serialization failure');
        }), RuntimeException::class);
        $row->refresh();
        $kept = [];
        $this->owned(function () use ($row, &$kept): void {
            $row->rename('third');
            $kept = $this->activeUnit();
        });

        $this->assertEquals([new RowRenamed($row->id, 'third')], $kept instanceof EventUnit ? $kept->batch() : []);
    }

    /**
     * Runs the work as the transaction owner would, and answers the unit it ran in.
     *
     * @param  callable(): void  $work
     */
    private function owned(callable $work): EventUnit
    {
        $database = $this->app->make(ConnectionInterface::class);
        $unit = null;
        $database->beginTransaction();
        $this->app->make(EventUnitLifecycle::class)->own(
            $database,
            'the test',
            function () use ($work, &$unit): void {
                $unit = $this->activeUnit();
                $work();
            },
            fn () => $database->commit(),
            fn () => $database->rollBack(),
        );

        return $unit ?? throw new RuntimeException('No unit was open.');
    }

    private function within(callable $work): void
    {
        $this->app->make(EventUnitLifecycle::class)->within($this->app->make(ConnectionInterface::class), $work(...));
    }

    private function activeUnit(): EventUnit
    {
        return $this->app->make(ActiveEventUnits::class)->activeFor($this->app->make(ConnectionInterface::class))
            ->getOrThrow(new RuntimeException('No unit is active.'));
    }
}
