<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Bus\Exceptions\RaisedOutsideUnit;
use App\Bus\Support\ActiveEventUnits;
use App\Bus\Support\OutsideCommandAllowance;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Tests\Fixtures\Contracts\RaisingRow;
use Tests\Fixtures\Contracts\RowRenamed;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * An event source written with no unit open fails by name where writes outside commands are not allowed, passes
 * inside a unit, and in the tests keeps its fact on the instance with no listener.
 */
final class RaisedOutsideUnitTest extends TestCase
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

    public function test_a_bare_save_fails_naming_the_model_when_writes_outside_commands_are_not_allowed(): void
    {
        $this->app->make(OutsideCommandAllowance::class)->forbid();

        $this->expectExceptionObject(RaisedOutsideUnit::for(RaisingRow::class));

        new RaisingRow()->rename('bare');
    }

    public function test_a_save_inside_a_unit_passes(): void
    {
        $this->app->make(OutsideCommandAllowance::class)->forbid();
        $row = new RaisingRow();
        $this->app->make(ActiveEventUnits::class)->open($row->getConnection());

        $row->rename('inside');

        $this->assertTrue($row->exists);
    }

    public function test_in_the_tests_a_bare_save_keeps_its_fact_on_the_instance(): void
    {
        $row = new RaisingRow();

        $row->rename('seeded');

        $this->assertEquals([new RowRenamed($row->id, 'seeded')], $row->takeRaisedEvents());
    }
}
