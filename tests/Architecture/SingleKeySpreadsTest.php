<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Process\Process;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A caller never spreads a method of its class that only ever gives one fixed key: it names the key and the method
 * returns the value (user message 22066). tools/refactoring/single-key-spreads.php lists every such spread.
 */
#[TimeLimit(seconds: 90, reason: 'It parses every PHP file of app, domain and tools.')]
final class SingleKeySpreadsTest extends TestCase
{
    private const string HOW_TO_FIX = 'Name the key at the caller and return only its value: ';

    private const string FIXTURE = 'tests/Fixtures/SingleKeySpreads/SpreadsOneKey.php';

    public function test_no_caller_spreads_a_method_of_one_fixed_key(): void
    {
        $output = $this->checkOutput('app', 'domain', 'tools');

        $this->assertSame('', trim($output), self::HOW_TO_FIX.$output);
    }

    public function test_a_literal_and_a_filled_one_key_array_are_listed_and_several_keys_are_not(): void
    {
        $output = $this->checkOutput(self::FIXTURE);

        $this->assertStringContainsString(self::FIXTURE.':15', $output);
        $this->assertStringContainsString(self::FIXTURE.':16', $output);
        $this->assertStringNotContainsString(self::FIXTURE.':17', $output);
    }

    private function checkOutput(string ...$paths): string
    {
        $check = new Process([PHP_BINARY, 'tools/refactoring/single-key-spreads.php', ...$paths], base_path());
        $check->run();

        return $check->getOutput();
    }
}
