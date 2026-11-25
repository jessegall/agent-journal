<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Values\DriverKey;
use Illuminate\Support\Facades\DB;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Section Storage identities: every table that names a driver stores its whole key, up to the key's
 * own limit, and the start, runtime, switch and agent rows keep the mode instead of a driver type.
 */
final class DriverKeyColumnsTest extends TestCase
{
    use RefreshHookDatabase;

    /**
     * Each table and the column that holds a driver key or a resume protocol.
     */
    private const array KEY_COLUMNS = [
        ['agent_sessions', 'driver_key'],
        ['session_requests', 'driver_key'],
        ['agent_runtimes', 'driver_key'],
        ['driver_switches', 'target_driver_key'],
        ['driver_conversations', 'resume_protocol'],
        ['driver_conversations', 'originating_driver_key'],
    ];

    /**
     * The columns the binding identity adds to each table.
     */
    private const array BINDING_COLUMNS = [
        ['session_requests', 'driver_type'],
        ['session_requests', 'remember'],
        ['session_requests', 'catalogue_revision'],
        ['agent_runtimes', 'driver_type'],
        ['driver_switches', 'driver_type'],
        ['agents', 'driver_type_preference'],
    ];

    /**
     * Binding columns nothing filled or read: the process generation fences a runtime and the start record keeps the
     * confirmed native binding, so these were removed.
     */
    private const array REMOVED_BINDING_COLUMNS = [
        ['session_requests', 'binding_id'],
        ['agent_runtimes', 'binding_id'],
        ['agent_runtimes', 'binding_generation'],
        ['driver_switches', 'source_binding_id'],
        ['driver_conversations', 'writer_binding_id'],
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

    public function test_the_unused_binding_columns_are_gone(): void
    {
        foreach (self::REMOVED_BINDING_COLUMNS as [$table, $column]) {
            $this->assertFalse(DB::getSchemaBuilder()->hasColumn($table, $column), "{$table}.{$column}");
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
