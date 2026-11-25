<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Support\ActiveEventUnits;
use App\Support\EventUnit;
use App\Support\ListenerRegistry;
use App\Support\TransactionListenerDrain;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Tests\Fixtures\Contracts\RaisingRow;
use Tests\Fixtures\Contracts\RowRenamed;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The writes a recording model makes besides save and delete stay visible to the capture: an insert that may meet
 * its row opens a slot only when it inserted, and a counter changed as an attribute and saved is captured.
 */
final class CaptureSafeWritesTest extends TestCase
{
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Schema::create('raising_rows', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->integer('times')->default(0);
            $table->timestamps();
        });
    }

    public function test_an_insert_if_absent_opens_one_slot_when_it_inserts_and_none_when_the_row_exists(): void
    {
        $unit = $this->openUnit();

        $inserted = RaisingRow::claimOnce(7, 'first');
        $repeated = RaisingRow::claimOnce(7, 'second');
        $this->drain($unit);

        $this->assertTrue($inserted->exists);
        $this->assertSame([], $repeated->takeRaisedEvents());
        $this->assertEquals([new RowRenamed(7, 'first')], $unit->batch());
        $this->assertSame('first', RaisingRow::query()->findOrFail(7)->name);
    }

    public function test_a_counter_changed_and_saved_is_captured(): void
    {
        $row = new RaisingRow();
        $row->name = 'counted';
        $row->save();
        $unit = $this->openUnit();

        $row->countVisit();
        $this->drain($unit);

        $this->assertSame(1, $row->refresh()->times);
        $this->assertEquals([new RowRenamed($row->id, 'counted')], $unit->batch());
    }

    private function openUnit(): EventUnit
    {
        return $this->app->make(ActiveEventUnits::class)->open(new RaisingRow()->getConnection());
    }

    private function drain(EventUnit $unit): void
    {
        new TransactionListenerDrain(new ListenerRegistry(), $this->app)->runTransactionListeners($unit);
    }
}
