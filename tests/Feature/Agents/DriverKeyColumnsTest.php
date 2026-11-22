<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Drivers\Values\DriverKey;
use Illuminate\Support\Facades\DB;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Doc 103, section Storage identities (task 2208): every table that names a driver stores its whole key, up to the key's
 * own limit, and the start, runtime, switch and agent rows keep the mode instead of a variant.
 */
final class DriverKeyColumnsTest extends TestCase
{
    use RefreshHookDatabase;

    /**
     * Each table and the column that holds a driver key or a resume protocol.
     */
    private const array KEY_COLUMNS = [
        ['agent_sessions', 'driver_key'],
        ['start_records', 'driver_key'],
        ['agent_runtimes', 'driver_key'],
        ['driver_switches', 'target_driver_key'],
        ['driver_conversations', 'resume_protocol'],
        ['driver_conversations', 'originating_driver_key'],
        ['navigation_requests', 'driver_key'],
        ['menu_entries', 'driver_key'],
    ];

    /**
     * The columns the binding identity adds to each table.
     */
    private const array BINDING_COLUMNS = [
        ['start_records', 'mode'],
        ['start_records', 'mode_intent'],
        ['start_records', 'remember'],
        ['start_records', 'binding_id'],
        ['start_records', 'catalogue_revision'],
        ['agent_runtimes', 'mode'],
        ['agent_runtimes', 'binding_id'],
        ['agent_runtimes', 'binding_generation'],
        ['driver_requests', 'binding_id'],
        ['driver_requests', 'expected_generation'],
        ['driver_requests', 'turn_id'],
        ['driver_switches', 'mode_intent'],
        ['driver_switches', 'source_binding_id'],
        ['driver_conversations', 'writer_binding_id'],
        ['agents', 'mode_preference'],
    ];

    public function test_every_driver_key_column_holds_the_longest_key(): void
    {
        foreach (self::KEY_COLUMNS as [$table, $column]) {
            $this->assertSame(DriverKey::CHARACTER_LIMIT, $this->lengthOf($table, $column), "{$table}.{$column}");
        }
    }

    public function test_the_binding_columns_are_there(): void
    {
        foreach (self::BINDING_COLUMNS as [$table, $column]) {
            $this->assertTrue(DB::getSchemaBuilder()->hasColumn($table, $column), "{$table}.{$column}");
        }
    }

    private function lengthOf(string $table, string $column): int
    {
        return (int) DB::table('information_schema.columns')
            ->where('table_name', $table)
            ->where('column_name', $column)
            ->value('character_maximum_length');
    }
}
