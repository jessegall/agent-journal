<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Bus\Support\ActiveEventUnits;
use App\Bus\Support\EventUnit;
use App\Bus\Support\EventUnitLifecycle;
use App\Bus\Support\RequiredDrain;
use App\Bus\Support\RequiredListenerRegistry;
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
 * An operation's held facts wait until it ends: drained after the work it did on the way, dropped when it throws,
 * kept back by a nested scope or barrier, raised once over a retry, and a sibling's facts are left as they are.
 */
final class EventHoldTest extends TestCase
{
    use CommitsHookRows;

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

    public function test_a_held_fact_is_drained_at_exit_after_the_work_done_inside(): void
    {
        [$held, $inner] = [$this->row(), $this->row()];

        $unit = $this->owned(fn () => $this->lifecycle()->holdUntilReturn(function () use ($held, $inner): void {
            $held->rename('held');
            $this->lifecycle()->within($this->database(), fn () => $inner->rename('first'));
        }));

        $this->assertEquals(
            [new RowRenamed($inner->id, 'first'), new RowNoted($inner->id), new RowRenamed($held->id, 'held')],
            $unit->batch(),
        );
    }

    public function test_a_throw_drops_the_held_fact(): void
    {
        $held = $this->row();
        $caught = '';

        $unit = $this->owned(function () use ($held, &$caught): void {
            try {
                $this->lifecycle()->holdUntilReturn(function () use ($held): void {
                    $held->rename('held');

                    throw new RuntimeException('the operation failed');
                });
            } catch (RuntimeException $failure) {
                $caught = $failure->getMessage();
            }
        });

        $this->assertSame('the operation failed', $caught);
        $this->assertSame([], $unit->batch());
    }

    public function test_a_nested_scope_or_a_barrier_does_not_release_the_held_fact(): void
    {
        $held = $this->row();
        $seen = [];

        $unit = $this->owned(fn () => $this->lifecycle()->holdUntilReturn(function () use ($held, &$seen): void {
            $held->rename('held');
            $this->lifecycle()->holdUntilReturn(fn () => null);
            $this->app->make(RequiredDrain::class)->applyRequired($this->activeUnit());
            $seen = $this->activeUnit()->batch();
        }));

        $this->assertSame([], $seen);
        $this->assertEquals([new RowRenamed($held->id, 'held')], $unit->batch());
    }

    public function test_a_retry_raises_the_held_fact_once(): void
    {
        $held = $this->row();
        $attempt = fn (bool $fails) => $this->owned(function () use ($held, $fails): void {
            $this->lifecycle()->holdUntilReturn(fn () => $held->rename('held'));

            if ($fails) {
                throw new RuntimeException('serialization failure');
            }
        });

        $this->assertThrows(fn () => $attempt(true), RuntimeException::class);
        $held->refresh();
        $unit = $attempt(false);

        $this->assertEquals([new RowRenamed($held->id, 'held')], $unit->batch());
    }

    public function test_a_siblings_facts_are_left_as_they_are(): void
    {
        [$sibling, $held] = [$this->row(), $this->row()];

        $unit = $this->owned(function () use ($sibling, $held): void {
            $this->lifecycle()->within($this->database(), fn () => $sibling->rename('sibling'));
            $this->lifecycle()->holdUntilReturn(fn () => $held->rename('held'));
        });

        $this->assertEquals(
            [new RowRenamed($sibling->id, 'sibling'), new RowRenamed($held->id, 'held')],
            $unit->batch(),
        );
    }

    private function row(): RaisingRow
    {
        return RaisingRow::query()->create(['name' => 'start']);
    }

    /**
     * @param  callable(): mixed  $work
     */
    private function owned(callable $work): EventUnit
    {
        $unit = null;
        $this->database()->beginTransaction();
        $this->lifecycle()->own(
            $this->database(),
            'the test',
            function () use ($work, &$unit): void {
                $unit = $this->activeUnit();
                $work();
            },
            fn () => $this->database()->commit(),
            fn () => $this->database()->rollBack(),
        );

        return $unit ?? throw new RuntimeException('No unit was open.');
    }

    private function lifecycle(): EventUnitLifecycle
    {
        return $this->app->make(EventUnitLifecycle::class);
    }

    private function database(): ConnectionInterface
    {
        return $this->app->make(ConnectionInterface::class);
    }

    private function activeUnit(): EventUnit
    {
        return $this->app->make(ActiveEventUnits::class)->activeFor($this->database())
            ->getOrThrow(new RuntimeException('No unit is active.'));
    }
}
