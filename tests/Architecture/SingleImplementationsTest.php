<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Process\Process;

/**
 * A contract that exactly one class implements is that class's name: the class is simply what the contract says, and
 * imports the contract with a Contract alias (user message 22177). tools/refactoring/single-implementations.php lists
 * every other.
 */
final class SingleImplementationsTest extends TestCase
{
    private const string HOW_TO_FIX = 'Name each class after its contract and import the contract as <Name>Contract: ';

    private const string FIXTURE = 'tests/Fixtures/SingleImplementations';

    public function test_every_only_implementation_carries_its_contracts_name(): void
    {
        $output = $this->checkOutput('app', 'domain');

        $this->assertSame('', trim($output), self::HOW_TO_FIX.$output);
    }

    public function test_an_only_implementation_of_another_name_is_listed_and_named_or_shared_ones_are_not(): void
    {
        preg_match_all('/\tclass (\w+) is the only implementation/', $this->checkOutput(self::FIXTURE), $listed);

        $this->assertSame(['DatabaseClock'], $listed[1]);
    }

    private function checkOutput(string ...$paths): string
    {
        $check = new Process([PHP_BINARY, 'tools/refactoring/single-implementations.php', ...$paths], base_path());
        $check->run();

        return $check->getOutput();
    }
}
