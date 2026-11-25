<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Process\Process;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * No return hands back a ternary: a choice is an if with an early return and a plain return after it (user messages
 * 21961 to 21966). tools/refactoring/ternary-returns.php lists every fault, and rewrites them with --fix.
 */
#[TimeLimit(seconds: 60, reason: 'It parses every PHP file of app, the domains and tools.')]
final class TernaryReturnsTest extends TestCase
{
    private const string HOW_TO_FIX = 'Rewrite these with --fix: ';

    private const string FIXTURE = 'tests/Fixtures/TernaryReturns/ReturnsATernary.php';

    public function test_no_return_hands_back_a_ternary(): void
    {
        $output = $this->checkOutput('app', 'domain', 'tools');

        $this->assertSame('', trim($output), self::HOW_TO_FIX.$output);
    }

    public function test_a_ternary_return_is_listed(): void
    {
        $this->assertStringContainsString('returns a ternary', $this->checkOutput(self::FIXTURE));
    }

    private function checkOutput(string ...$paths): string
    {
        $check = new Process([PHP_BINARY, 'tools/refactoring/ternary-returns.php', ...$paths], base_path());
        $check->run();

        return $check->getOutput();
    }
}
