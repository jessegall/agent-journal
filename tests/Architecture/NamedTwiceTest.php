<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\NamedTwiceScan;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * No test makes a record under a name and at once reads it back by that name: the fixture's create verb makes it and
 * gives it back.
 */
#[TimeLimit(seconds: 20, reason: 'It parses every test file, from the scan cache after the first run.')]
final class NamedTwiceTest extends TestCase
{
    private const string HOW_TO_FIX = 'Make the record with the create verb, which gives it back; add the verb when the '
        .'fixture has none.';

    private const string FIXTURE = 'tests/Fixtures/Architecture/NamedTwice/NamedTwiceChains.php';

    public function test_no_test_names_a_record_twice_to_make_and_read_it(): void
    {
        $found = [];

        foreach (ScanCache::findingsInFolders(new NamedTwiceScan(), self::foldersWithTests()) as $path => $chains) {
            $relative = str_replace(base_path().'/', '', $path);

            if ($relative === self::FIXTURE) {
                continue;
            }

            foreach ($chains as $chain) {
                $verb = 'create'.ucfirst($chain['verb']);
                $found[] = "{$relative}:{$chain['line']} {$chain['verb']}('{$chain['name']}') read back: use {$verb}";
            }
        }

        $this->assertSame([], $found, self::HOW_TO_FIX);
    }

    public function test_the_scan_finds_a_name_read_back_at_once_and_passes_the_others(): void
    {
        $chains = ScanCache::findingsByFile(new NamedTwiceScan(), [base_path(self::FIXTURE)])[base_path(self::FIXTURE)];

        $this->assertSame([15], array_column($chains, 'line'));
    }

    /**
     * The project's tests and every domain's.
     *
     * @return list<string>
     */
    private static function foldersWithTests(): array
    {
        $domainTests = array_map(fn (string $code) => dirname($code).'/tests', DomainFiles::domainCode());

        return array_values(array_filter([base_path('tests'), ...$domainTests], is_dir(...)));
    }
}
