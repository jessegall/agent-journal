<?php

declare(strict_types=1);

namespace Tests\Unit\Seeding;

use App\Models\Agents\Agent;
use PHPUnit\Framework\TestCase;
use Tests\Support\Seeding\FixtureAliases;
use Tests\Support\Seeding\FixtureRefused;

/**
 * A fixture's names keep each record's type and id: one read back is that id, a name is taken once, and a missing one
 * names its owner, type and name.
 */
final class FixtureAliasesTest extends TestCase
{
    public function test_a_remembered_record_reads_back_as_its_type_and_id(): void
    {
        $aliases = new FixtureAliases('PlanFixtures');
        $agent = new Agent()->forceFill(['id' => 'agent-1']);

        $this->assertSame($agent, $aliases->remember('Ada', $agent));
        $aliases->rememberResult('Run', 7, 'run');

        $this->assertSame(['agent-1', 7], [$aliases->read(Agent::class, 'Ada'), $aliases->read('run', 'Run')]);
    }

    public function test_a_missing_name_names_its_owner_type_and_name(): void
    {
        $aliases = new FixtureAliases('PlanFixtures');
        $aliases->rememberResult('Build', 3, 'phase');

        $this->expectExceptionObject(FixtureRefused::missingAlias('plan', 'Build', 'PlanFixtures'));

        $aliases->read('plan', 'Build');
    }

    public function test_a_taken_name_is_refused_whatever_its_type(): void
    {
        $aliases = new FixtureAliases('PlanFixtures');
        $aliases->rememberResult('Build', 3, 'phase');

        $this->expectExceptionObject(FixtureRefused::occupiedAlias('Build', 'phase'));

        $aliases->claim('Build');
    }
}
