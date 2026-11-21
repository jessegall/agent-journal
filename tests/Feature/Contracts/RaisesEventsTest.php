<?php

declare(strict_types=1);

namespace Tests\Feature\Contracts;

use App\Bus\Exceptions\RowWriteRefused;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Tests\Fixtures\Contracts\RaisingRow;
use Tests\Fixtures\Contracts\RowRenamed;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A model that records its facts holds them on itself after its own save, raises nothing when the save is refused,
 * and hands them over once.
 */
final class RaisesEventsTest extends TestCase
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

    public function test_a_saved_transition_holds_its_fact_and_hands_it_over_once(): void
    {
        $row = new RaisingRow();

        $row->rename('first');

        $this->assertEquals([new RowRenamed($row->id, 'first')], $row->takeRaisedEvents());
        $this->assertSame([], $row->takeRaisedEvents());
    }

    public function test_a_refused_save_raises_nothing_even_after_an_earlier_save(): void
    {
        $row = new RaisingRow();
        $row->rename('first');
        $row->takeRaisedEvents();
        RaisingRow::saving(fn () => false);

        $this->assertThrows(fn () => $row->rename('second'), RowWriteRefused::class);
        $this->assertSame([], $row->takeRaisedEvents());
    }
}
