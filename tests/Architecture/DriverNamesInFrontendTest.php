<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Agents\Drivers\Contracts\DriverCatalogue;
use App\Values\DriverFamily;
use Tests\Architecture\Support\WordLines;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * The frontend names no driver: a family's key, alias, host name, provider or mark file reaches a page only through
 * the driver looks of the app context, so a new family shows everywhere with no frontend change. Tests and the test
 * kit fake those looks and may name them, and the generated types are the server's.
 */
#[TimeLimit(seconds: 15, reason: 'It reads every line of the frontend.')]
final class DriverNamesInFrontendTest extends TestCase
{
    private const string HOW_TO_FIX
        = 'Read the driver from useAppContext().drivers or driverLook(), never by its name.';

    private const string FIXTURE = 'tests/Fixtures/DriverNames';

    /**
     * The files that may name a driver: tests, the test kit's faked looks, and the types generated from the server.
     */
    private const string ALLOWED_FILE = '#\.test\.ts:|/resources/js/kit/testing/|/resources/js/types/generated/#';

    public function test_no_frontend_file_names_a_driver(): void
    {
        $folders = [resource_path('js'), ...(glob(base_path('domain/*/resources/js'), GLOB_ONLYDIR) ?: [])];
        $found = array_values(array_filter(
            WordLines::in($this->driverNames(), $folders),
            fn (string $line): bool => preg_match(self::ALLOWED_FILE, $line) !== 1,
        ));

        $this->assertSame([], $found, self::HOW_TO_FIX);
    }

    public function test_a_frontend_file_naming_a_family_key_is_found_by_file_and_line(): void
    {
        $this->assertSame(
            [base_path(self::FIXTURE.'/driverChoice.ts').':2'],
            WordLines::in($this->driverNames(), [base_path(self::FIXTURE)]),
        );
    }

    /**
     * Every name of a registered family, in any case: its key, its aliases, its host name, its provider and its mark
     * file's name.
     */
    private function driverNames(): string
    {
        $names = [];

        foreach ($this->app->make(DriverCatalogue::class)->families() as $family) {
            $names = [...$names, ...$this->namesOf($family)];
        }

        $quoted = array_map(fn (string $name): string => preg_quote($name, '/'), array_unique($names));

        return '/'.implode('|', $quoted).'/i';
    }

    /**
     * @return list<string>
     */
    private function namesOf(DriverFamily $family): array
    {
        return [
            $family->key,
            ...$family->aliases,
            $family->hostName,
            $family->provider->key,
            pathinfo($family->markAsset, PATHINFO_FILENAME),
        ];
    }
}
