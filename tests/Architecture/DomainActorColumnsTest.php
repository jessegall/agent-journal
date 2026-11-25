<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Support\DomainEntry;
use App\Support\DomainRegistry;
use Tests\Architecture\Support\AgentReferences;

/**
 * A domain record names actors, never agents: who holds a record is a Core assignment to an actor, and
 * where an agent works on it is a frame on that agent's stack. So no table a domain owns has a column for an agent or
 * an agent session, and no domain model takes or returns a stack target or an agent context. Only Core's Agents and
 * Hooks tables may name agents and sessions.
 */
final class DomainActorColumnsTest extends TestCase
{
    private const string DOMAIN_TABLE_ADVICE = 'A domain table names an agent or an agent session; '
        .'name an actor (actor_type, actor_id) or use a frame on the stack.';

    private const string CORE_TABLE_ADVICE = 'A Core table above Agents and Hooks names an agent or a session; '
        .'name an actor.';

    private const string MODEL_ADVICE = 'A domain model names an agent stack or request; '
        .'it should name an actor or a state instead.';

    /**
     * The columns still being removed, each with the work that removes it. The list only shrinks: a new entry fails
     * review, and a removed column must leave the list.
     */
    private const array BEING_REMOVED = [];

    /**
     * The model methods still being removed, each with the work that removes it; the list only shrinks.
     */
    private const array METHODS_BEING_REMOVED = [];

    public function test_no_domain_table_names_an_agent_or_a_session(): void
    {
        $columns = [];

        foreach ($this->app->make(DomainRegistry::class)->all() as $entry) {
            array_push($columns, ...AgentReferences::columnsIn(self::migrationsOf($entry)));
        }

        sort($columns);
        $expected = array_keys(self::BEING_REMOVED);
        sort($expected);

        $this->assertSame(
            $expected,
            $columns,
            self::DOMAIN_TABLE_ADVICE,
        );
    }

    /**
     * Core's areas above Agents and Hooks name actors in their tables too: name actors, never agents.
     */
    public function test_no_core_table_above_agents_and_hooks_names_an_agent_or_a_session(): void
    {
        $columns = [];

        foreach (['Supervision', 'Scripts', 'Profiles'] as $area) {
            $folder = app_path("{$area}/Database/Migrations");

            if (is_dir($folder)) {
                array_push($columns, ...AgentReferences::columnsIn($folder));
            }
        }

        $this->assertSame([], $columns, self::CORE_TABLE_ADVICE);
    }

    public function test_no_domain_model_takes_or_returns_a_stack_target_or_agent_context(): void
    {
        $methods = [];

        foreach ($this->app->make(DomainRegistry::class)->all() as $entry) {
            array_push($methods, ...AgentReferences::modelMethodsIn($entry->folder.'/Models'));
        }

        $this->assertSame(
            array_keys(self::METHODS_BEING_REMOVED),
            $methods,
            self::MODEL_ADVICE,
        );
    }

    public function test_a_planted_agent_column_and_model_method_are_found(): void
    {
        $folder = base_path('tests/Fixtures/Boundary/AgentColumns');

        $this->assertSame(
            ['planted_jobs.agent_id', 'planted_jobs.origin_session_id'],
            AgentReferences::columnsIn($folder.'/database/migrations'),
        );
        $this->assertSame(
            ['PlantedJob::startFor()', 'PlantedJob::worker()'],
            AgentReferences::modelMethodsIn($folder.'/Models'),
        );
    }

    private static function migrationsOf(DomainEntry $entry): string
    {
        return dirname($entry->folder).'/database/migrations';
    }
}
