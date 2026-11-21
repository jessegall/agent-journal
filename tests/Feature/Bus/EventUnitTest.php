<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Bus\Exceptions\CausalDepthExceeded;
use App\Bus\Support\ActiveEventUnits;
use App\Bus\Support\EventUnit;
use App\Bus\Support\RequiredDrain;
use App\Domains\Support\RequiredListenerRegistry;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Schema;
use Tests\Fixtures\Contracts\NotesFirstRename;
use Tests\Fixtures\Contracts\RaisingRow;
use Tests\Fixtures\Contracts\RenamesAgain;
use Tests\Fixtures\Contracts\RowNoted;
use Tests\Fixtures\Contracts\RowRenamed;
use Tests\Fixtures\ModelWrites\Models\OwnRowWriter;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;
use WeakReference;

/**
 * The event unit keeps the facts of its connection's saves in save order and holds only the row saved last; its
 * required drain runs each fact's required listeners first in first out, a raised fact after its siblings, and stops
 * a loop at its depth limit naming the chain.
 */
final class EventUnitTest extends TestCase
{
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Schema::create('raising_rows', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });
    }

    public function test_saves_of_a_b_a_yield_their_facts_in_save_order(): void
    {
        $unit = $this->openUnit();
        [$first, $second] = [new RaisingRow(), new RaisingRow()];

        $first->rename('x');
        $second->rename('y');
        $first->rename('z');
        $this->drain($unit, []);

        $this->assertEquals(
            [new RowRenamed($first->id, 'x'), new RowRenamed($second->id, 'y'), new RowRenamed($first->id, 'z')],
            $unit->batch(),
        );
    }

    public function test_a_selectively_faked_business_event_leaves_the_capture_on(): void
    {
        Event::fake([RowRenamed::class]);
        $unit = $this->openUnit();
        $row = new RaisingRow();

        $row->rename('x');
        $this->drain($unit, []);

        $this->assertEquals([new RowRenamed($row->id, 'x')], $unit->batch());
    }

    public function test_many_saves_without_facts_hold_only_the_row_saved_last(): void
    {
        $unit = new EventUnit();
        $earlier = new RaisingRow();
        $watched = WeakReference::create($earlier);
        $unit->openSlot($earlier);

        for ($save = 0; $save < 10_000; $save++) {
            $unit->openSlot(new RaisingRow());
        }

        unset($earlier);
        $unit->seal();

        $this->assertNull($watched->get());
        $this->assertNull($unit->takePending());
    }

    public function test_a_required_listener_runs_on_drain_and_its_fact_follows_its_siblings(): void
    {
        $unit = $this->openUnit();
        [$first, $second] = [new RaisingRow(), new RaisingRow()];

        $first->rename('first');
        $second->rename('second');
        $this->drain($unit, [RowRenamed::class => [NotesFirstRename::class.'@handle']]);

        $this->assertEquals(
            [new RowRenamed($first->id, 'first'), new RowRenamed($second->id, 'second'), new RowNoted($first->id)],
            $unit->batch(),
        );
    }

    public function test_a_loop_of_required_listeners_stops_at_the_limit_naming_the_chain(): void
    {
        $unit = $this->openUnit();
        new RaisingRow()->rename('again');
        $chain = array_fill(0, RequiredDrain::CAUSAL_DEPTH_LIMIT + 1, RowRenamed::class);

        $this->expectExceptionObject(CausalDepthExceeded::along($chain, RequiredDrain::CAUSAL_DEPTH_LIMIT));

        try {
            $this->drain($unit, [RowRenamed::class => [RenamesAgain::class.'@handle']]);
        } finally {
            $this->assertTrue($unit->hasFailed());
        }
    }

    public function test_only_a_model_that_raises_events_registers_the_capture(): void
    {
        new RaisingRow();
        new OwnRowWriter();
        $dispatcher = Model::getEventDispatcher();

        $this->assertTrue($dispatcher?->hasListeners('eloquent.saved: '.RaisingRow::class));
        $this->assertFalse($dispatcher?->hasListeners('eloquent.saved: '.OwnRowWriter::class));
    }

    private function openUnit(): EventUnit
    {
        return $this->app->make(ActiveEventUnits::class)->open(new RaisingRow()->getConnection());
    }

    /**
     * @param  array<string, list<string>>  $required
     */
    private function drain(EventUnit $unit, array $required): void
    {
        $drain = new RequiredDrain(new RequiredListenerRegistry($required), $this->app);
        $drain->applyRequired($unit);
    }
}
