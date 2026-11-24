<?php

declare(strict_types=1);

namespace Tests\Architecture;

use PHPUnit\Framework\TestCase;
use SimpleXMLElement;
use Symfony\Component\Finder\Finder;

/**
 * The installation checks (tools/installation-checks) start real containers and sessions: no test suite of
 * phpunit.xml reaches their folder, and none of their files is named as a test, so composer test never runs them.
 */
final class InstallationChecksStayOutOfTheSuiteTest extends TestCase
{
    private const string FOLDER = 'tools/installation-checks';

    public function test_no_test_suite_reaches_the_installation_checks(): void
    {
        $configuration = new SimpleXMLElement((string) file_get_contents(dirname(__DIR__, 2).'/phpunit.xml'));
        $folders = array_map('strval', $configuration->xpath('//testsuite/directory') ?: []);

        $this->assertSame([], array_values(array_filter(
            $folders,
            fn (string $folder): bool => str_starts_with(self::FOLDER, rtrim($folder, '/')) || str_starts_with($folder, 'tools'),
        )));
    }

    public function test_no_installation_check_is_named_as_a_test(): void
    {
        $tests = Finder::create()->files()->in(dirname(__DIR__, 2).'/'.self::FOLDER)->name(['*Test.php', '*.test.ts']);

        $this->assertSame(0, iterator_count($tests));
    }
}
