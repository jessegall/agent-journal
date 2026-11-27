<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\ToolCheck;

/**
 * Core never names a domain, read as text, anywhere in its code, config, routes, migrations, frontend or test support;
 * only the composition files that install the domains may. It covers what DomainBoundaryTest's class scan cannot see;
 * tools/refactoring/core-domain-text.php lists every mention.
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

    public function test_a_domain_named_in_a_string_config_import_or_test_support_is_listed_and_composition_not(): void
    {
        preg_match_all('/^(\S+):(\d+)\t/m', $this->checkOutput(base_path(self::FIXTURE)), $found, PREG_SET_ORDER);

        $this->assertSame(
            [
                'app/Support/ShelfLookup.php:8',
                'config/library.php:6',
                'resources/js/pages/Shelf.ts:2',
                'tests/Support/ShelfJournal.php:6',
            ],
            array_map(fn (array $match) => "{$match[1]}:{$match[2]}", $found),
        );
    }

    private function checkOutput(string $root): string
    {
        $check = ToolCheck::run([PHP_BINARY, 'tools/refactoring/core-domain-text.php', $root]);

        return $check->output();
    }
}
