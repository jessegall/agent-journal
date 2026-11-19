<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\AreaCycles;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * No Core area, domain or the domain foundation reaches back into an area that reaches it, directly or through others;
 * folders inside one area may name each other (question 26).
 */
#[TimeLimit(seconds: 15, reason: 'It parses every PHP file of the project.')]
final class AreaCycleTest extends TestCase
{
    public function test_a_cycle_through_three_areas_is_named_and_a_one_way_chain_passes(): void
    {
        $cycle = AreaCycles::ofEdges([
            'App\\Agents' => ['App\\Hooks' => 'a'],
            'App\\Hooks' => ['App\\Links' => 'b'],
            'App\\Links' => ['App\\Agents' => 'c'],
            'Domain\\Plans' => ['Domain\\Tasks' => 'd'],
        ]);

        $this->assertSame(
            ['App\\Agents, App\\Hooks, App\\Links: App\\Agents -> App\\Hooks (a); App\\Hooks -> App\\Links (b); '
                .'App\\Links -> App\\Agents (c)'],
            $cycle->cycles(),
        );
        $this->assertSame(
            [],
            AreaCycles::ofEdges(
                ['Domain\\Plans' => ['Domain\\Tasks' => 'd'], 'Domain\\Tasks' => ['App\\Hooks' => 'e']],
            )->cycles(),
        );
    }

    public function test_no_areas_of_the_core_or_the_domains_reach_each_other(): void
    {
        $this->assertSame([], AreaCycles::ofProject(app_path(), base_path('domain'))->cycles());
    }
}
