<?php

declare(strict_types=1);

namespace Tests\Unit\Ui;

use App\Support\Layout\LayoutRowData;
use App\Support\Layout\LayoutTableData;
use App\Web\Creation\Exceptions\MissingFields;
use Generator;
use Spatie\LaravelData\Optional;
use Tests\TestCase;

final class LayoutTableDataTest extends TestCase
{
    public function test_rows_are_required(): void
    {
        $this->expectExceptionObject(MissingFields::forType(LayoutTableData::class, 'rows'));

        LayoutTableData::build()->finish();
    }

    public function test_an_explicitly_empty_iterable_yields_empty_rows(): void
    {
        $table = LayoutTableData::build()->rows([], self::row(...))->finish();

        $this->assertSame([], $table->rows);
    }

    public function test_each_record_is_mapped_once_in_order_and_keeps_its_row_defaults(): void
    {
        $records = (static function (): Generator {
            yield 'second';
            yield 'first';
        })();
        $mapped = [];

        $table = LayoutTableData::build()->rows($records, static function (string $label) use (&$mapped): LayoutRowData {
            $mapped[] = $label;

            return self::row($label);
        })->finish();

        $this->assertSame(['second', 'first'], $mapped);
        $this->assertSame(['second', 'first'], array_column($table->rows, 'label'));
        $this->assertFalse($table->rows[0]->isCurrent);
        $this->assertInstanceOf(Optional::class, $table->rows[0]->detail);
    }

    public function test_fields_and_finished_tables_are_independent(): void
    {
        $firstFields = LayoutTableData::build()->rows(['first'], self::row(...));
        $secondFields = LayoutTableData::build()->rows(['second'], self::row(...));
        $first = $firstFields->finish();
        $second = $secondFields->finish();

        $firstFields->rows(['changed'], self::row(...));

        $this->assertSame(['first'], array_column($first->rows, 'label'));
        $this->assertSame(['second'], array_column($second->rows, 'label'));
        $this->assertSame(['changed'], array_column($firstFields->finish()->rows, 'label'));
    }

    private static function row(string $label): LayoutRowData
    {
        return LayoutRowData::build()->key($label)->label($label)->finish();
    }
}
