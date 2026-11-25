<?php

declare(strict_types=1);

namespace Tests\Feature\Reads;

use App\Exceptions\LazyLoadRefused;
use App\Exceptions\QueryInValueRead;
use App\Models\Access\User;
use App\Models\Agents\AgentSession;
use App\Support\ReadMeter;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CountsReads;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A relation is loaded for the whole set or not read at all, and reading or rendering a value runs no query.
 */
final class ValueReadsTest extends TestCase
{
    use CountsReads;
    use RefreshHookDatabase;

    public function test_touching_an_unloaded_relation_on_one_model_is_refused_before_a_query(): void
    {
        $start = TestStart::start();
        $session = AgentSession::query()->findOrFail($start->session->id);

        $counts = $this->readCounts(
            fn () => $this->assertThrows(fn () => $session->agent, LazyLoadRefused::class),
        );

        $this->assertSame(0, $counts->queriesRun);
        $this->assertSame(
            $start->agent->id,
            AgentSession::query()->with('agent')->findOrFail($start->session->id)->agent->id,
        );
    }

    public function test_a_query_inside_a_value_read_is_refused_and_a_pure_one_works(): void
    {
        $meter = ReadMeter::ofCurrentScope();

        $this->assertSame(2, $meter->withoutQueries('a pure value', fn () => 1 + 1));
        $this->expectExceptionObject(QueryInValueRead::during('a reading value'));

        $meter->withoutQueries('a reading value', fn () => User::query()->count());
    }
}
