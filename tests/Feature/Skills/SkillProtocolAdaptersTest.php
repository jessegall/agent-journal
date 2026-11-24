<?php

declare(strict_types=1);

namespace Tests\Feature\Skills;

use App\Contracts\Drivers\DriverCatalogue;
use App\Enums\DriverType;
use App\Support\DefaultDrivers;
use App\Support\Drivers\DriverSkillAdapters;
use App\Values\DriverKey;
use Tests\TestCase;

/**
 * Ownership and interface examples: a skill adapter is found by the skill protocol a registration names, so
 * both drivers of a family write and install skills through one adapter.
 */
final class SkillProtocolAdaptersTest extends TestCase
{
    public function test_both_drivers_of_a_family_read_one_skill_adapter(): void
    {
        $drivers = $this->app->make(DriverCatalogue::class);
        $adapters = $this->app->make(DriverSkillAdapters::class);

        foreach (DefaultDrivers::familyKeys() as $family) {
            $terminal = $drivers->forKey($drivers->keyFor($family, DriverType::Terminal))->descriptor();
            $headless = $drivers->forKey($drivers->keyFor($family, DriverType::Headless))->descriptor();

            $this->assertSame(
                $adapters->for(DriverKey::from($terminal->skillProtocol)),
                $adapters->for(DriverKey::from($headless->skillProtocol)),
                $family,
            );
        }
    }
}
