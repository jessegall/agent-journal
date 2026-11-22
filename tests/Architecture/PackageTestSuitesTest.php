<?php

declare(strict_types=1);

namespace Tests\Architecture;

use PHPUnit\Framework\TestCase;
use SimpleXMLElement;

/**
 * Every package's Unit and Feature tests sit in a suite of phpunit.xml, so the full run reaches a new package's tests
 * without anyone editing the file.
 */
final class PackageTestSuitesTest extends TestCase
{
    public function test_every_package_test_folder_is_in_a_suite(): void
    {
        $root = dirname(__DIR__, 2);
        $configuration = new SimpleXMLElement((string) file_get_contents($root.'/phpunit.xml'));
        $covered = [];

        foreach ($configuration->xpath('//testsuites/testsuite/directory') ?: [] as $directory) {
            $covered = [...$covered, ...(glob($root.'/'.$directory, GLOB_ONLYDIR) ?: [])];
        }

        $folders = [
            ...(glob($root.'/domain/*/tests/Unit', GLOB_ONLYDIR) ?: []),
            ...(glob($root.'/domain/*/tests/Feature', GLOB_ONLYDIR) ?: []),
        ];

        $this->assertNotSame([], $folders);
        $this->assertSame([], array_values(array_diff($folders, $covered)));
    }
}
