<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\AreaCycles;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Core's areas keep the one-way map of doc 42 revision 8 (task 955): Operations names no other area, Agents never names
 * the areas built on it, and Hooks, Profiles and Scripts never name the Engine.
 */
#[TimeLimit(seconds: 15, reason: 'It parses every PHP file of the project.')]
final class AreaMapTest extends TestCase
{
    private const array FORBIDDEN = [
        'App\\Operations' => [
            'App\\Agents', 'App\\Bus', 'App\\Hooks', 'App\\Profiles', 'App\\Scripts', 'App\\Engine',
            'App\\Supervision', 'App\\Actors', 'App\\Assignments',
        ],
        'App\\Agents' => ['App\\Profiles', 'App\\Hooks', 'App\\Scripts', 'App\\Engine', 'App\\Supervision'],
        'App\\Hooks' => ['App\\Engine'],
        'App\\Profiles' => ['App\\Engine'],
        'App\\Scripts' => ['App\\Engine'],
    ];

    public function test_a_named_forbidden_area_is_reported_with_its_use(): void
    {
        $areas = AreaCycles::ofEdges(['App\\Agents' => ['App\\Hooks' => 'app/Agents/X.php:3 uses App\\Hooks\\Y']]);

        $this->assertSame(
            ['App\\Agents -> App\\Hooks (app/Agents/X.php:3 uses App\\Hooks\\Y)'],
            $areas->forbiddenUses(self::FORBIDDEN),
        );
    }

    public function test_core_keeps_the_one_way_area_map(): void
    {
        $areas = AreaCycles::ofProject(app_path(), base_path('domain'));

        $this->assertSame([], $areas->forbiddenUses(self::FORBIDDEN));
    }
}
