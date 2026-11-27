<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\ParsedTrees;
use Tests\Architecture\Support\ParserMakingScan;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A run parses each PHP file once: ParsedTrees keeps every tree by its content for every scan, test and worker, and
 * no other test code makes a parser of its own (users 29310, 29331).
 */
#[TimeLimit(seconds: 15, reason: 'Its scan reads every file of tests/, which a cold tree cache parses once.')]
final class ParsedTreesTest extends TestCase
{
    /**
     * The test of the parser packages themselves, which makes one to prove the package loads.
     */
    private const string PACKAGE_TEST = 'tests/Architecture/ParserPackagesTest.php';

    public function test_a_file_is_parsed_once_and_its_tree_read_after(): void
    {
        $code = "<?php\n\nfinal class ParsedOnce".bin2hex(random_bytes(6))." {}\n";
        $before = ParsedTrees::parseCount();

        $first = ParsedTrees::of('parsed-once.php', $code);
        $second = ParsedTrees::of('parsed-once.php', $code);

        $this->assertSame($before + 1, ParsedTrees::parseCount());
        $this->assertEquals($first, $second);
    }

    public function test_no_test_code_makes_a_parser_of_its_own(): void
    {
        $byFile = ScanCache::findingsInFolders(new ParserMakingScan(), [base_path('tests')]);
        $makings = array_merge([], ...array_values($byFile));
        $outside = array_values(array_filter(
            $makings,
            fn (string $making) => ! str_contains($making, 'Support/ParsedTrees.php')
                && ! str_contains($making, self::PACKAGE_TEST),
        ));

        $this->assertSame([], $outside, 'Read a tree through ParsedFile::fromPath instead of parsing it again.');
    }
}
