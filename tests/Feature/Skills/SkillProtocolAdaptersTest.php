<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Agents\Enums\DriverVariant;
use App\Drivers\Contracts\DriverCatalogue;
use App\Drivers\Support\DefaultDrivers;
use App\Drivers\Values\DriverKey;
use App\Skills\Drivers\DriverSkillAdapters;
use Tests\TestCase;

/**
 * Doc 103, Ownership and interface examples: a skill adapter is found by the skill protocol a registration names, so
 * both drivers of a family write and install skills through one adapter.
 */
final class SkillProtocolAdaptersTest extends TestCase
{
    public function test_both_drivers_of_a_family_read_one_skill_adapter(): void
    {
        $drivers = $this->app->make(DriverCatalogue::class);
        $adapters = $this->app->make(DriverSkillAdapters::class);

        foreach (DefaultDrivers::familyKeys() as $family) {
            $terminal = $drivers->forKey($drivers->keyFor($family, DriverVariant::Terminal))->descriptor();
            $headless = $drivers->forKey($drivers->keyFor($family, DriverVariant::Headless))->descriptor();

            $this->assertSame(
                $adapters->for(DriverKey::from($terminal->skillProtocol)),
                $adapters->for(DriverKey::from($headless->skillProtocol)),
                $family,
            );
        }
    }
}
