<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Process\Process;

/**
 * Core never names a domain, read as text, in code, strings, comments, config, routes, migrations, bootstrap or the
 * core frontend; only the composition files that install the domains may. It closes what
 * DomainBoundaryTest's class scan cannot see. tools/refactoring/core-domain-text.php lists every mention.
 */
final class CoreNamesNoDomainTest extends TestCase
{
    private const string HOW_TO_FIX = 'Core reaches a domain only through what it exports: ';

    private const string FIXTURE = 'tests/Fixtures/CoreDomainText';

    public function test_core_names_no_domain(): void
    {
        $output = $this->checkOutput(base_path());

        $this->assertSame('', trim($output), self::HOW_TO_FIX.$output);
    }

    public function test_a_domain_named_in_a_string_config_or_import_is_listed_and_composition_is_not(): void
    {
        preg_match_all('/^(\S+):(\d+)\t/m', $this->checkOutput(base_path(self::FIXTURE)), $found, PREG_SET_ORDER);

        $this->assertSame(
            ['app/Support/ShelfLookup.php:6', 'config/library.php:4', 'resources/js/pages/Shelf.ts:2'],
            array_map(fn (array $match) => "{$match[1]}:{$match[2]}", $found),
        );
    }

    private function checkOutput(string $root): string
    {
        $check = new Process([PHP_BINARY, 'tools/refactoring/core-domain-text.php', $root], base_path());
        $check->run();

        return $check->getOutput();
    }
}
