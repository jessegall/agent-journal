<?php

declare(strict_types=1);

namespace Tests\Unit\Drivers;

use App\Support\Compatibility\DriverCompatibility;
use App\Support\DefaultDrivers;
use App\Support\Drivers\Profiles\DriverProfiles;
use Tests\TestCase;

/**
 * The providers a journal-agent release imports, listed in resources/drivers/providers.json for the release builder,
 * name each program the journal starts by the program its profile runs and the build the journal pins.
 */
final class ReleaseProvidersTest extends TestCase
{
    private const string PROVIDERS = __DIR__.'/../../../resources/drivers/providers.json';

    public function test_each_release_provider_is_the_program_and_pinned_build_the_journal_starts(): void
    {
        $profiles = $this->app->make(DriverProfiles::class);
        $listed = json_decode((string) file_get_contents(self::PROVIDERS), true, flags: JSON_THROW_ON_ERROR);
        $expected = array_map(
            fn (string $family) => [
                'name' => $family,
                'executable' => basename($profiles->ofFamily($family)->versionProbe('/work')->argv[0]),
                'build' => DriverCompatibility::pinned($family)->version,
            ],
            [DefaultDrivers::CLAUDE_CODE, DefaultDrivers::CODEX],
        );

        $this->assertSame($expected, $listed);
    }
}
