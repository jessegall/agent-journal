<?php

declare(strict_types=1);

namespace Tests\Feature\Settings;

use App\Contracts\Settings\SettingsCatalogue;
use App\Exceptions\SettingsOwnerUnknown;
use App\Support\DomainRegistry;
use Tests\Support\CountsReads;
use Tests\Support\Settings\UsesReviewsSettings;
use Tests\TestCase;

/**
 * The owner inspects one owner's settings from one record read: every group and setting in declaration order with
 * its type, constraints, default and stored value, invalid stored values marked so they can be reset, and nobody else
 * sees any of it.
 */
final class SettingsCatalogueTest extends TestCase
{
    use CountsReads;
    use UsesReviewsSettings;

    /**
     * Every installed domain, since this test reads the switches, pages and settings of the domains as a whole.
     */
    protected static function bootedDomains(): array
    {
        return DomainRegistry::installedClasses(dirname(__DIR__, 3));
    }

    /**
     * The reset runs through the bus, which commits for real, so this table is emptied around each test.
     */
    public function test_an_owner_that_registers_no_settings_is_unknown(): void
    {
        $this->expectException(SettingsOwnerUnknown::class);

        $this->catalogue('Nobody');
    }

    /**
     * @return array<string, mixed>
     */
    private function catalogue(string $owner): array
    {
        return $this->app->make(SettingsCatalogue::class)->owner($owner)->toArray();
    }
}
