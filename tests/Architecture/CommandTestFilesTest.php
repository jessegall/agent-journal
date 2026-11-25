<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Symfony\Component\Process\Process;

/**
 * Every command has its own test file that seeds what it needs and covers its scenarios (rule 104): a core command in
 * tests/Commands/<Subject>/<Name>Test.php, a domain's in domain/<Domain>/tests/Commands/<Name>Test.php.
 * tools/refactoring/command-test-files.php lists each command without one.
 */
final class CommandTestFilesTest extends TestCase
{
    private const string HOW_TO_FIX = 'Write each command its own test file at the place named: ';

    private const string FIXTURE = 'tests/Fixtures/CommandTestFiles';

    public function test_every_command_has_its_own_test_file(): void
    {
        $output = $this->checkOutput();

        $this->assertSame('', trim($output), self::HOW_TO_FIX."\n".$output);
    }

    public function test_a_core_and_a_domain_command_without_a_test_file_are_listed_and_tested_ones_are_not(): void
    {
        $missing = explode("\n", trim($this->checkOutput(base_path(self::FIXTURE))));
        $domainCommand = 'domain/Shelves/src/Commands/StackBook/StackBookCommand.php';

        $this->assertSame([
            "app/Commands/Notes/EraseNote/EraseNoteCommand.php\ttests/Commands/Notes/EraseNoteTest.php",
            "{$domainCommand}\tdomain/Shelves/tests/Commands/StackBookTest.php",
        ], $missing);
    }

    private function checkOutput(string ...$root): string
    {
        $check = new Process([PHP_BINARY, 'tools/refactoring/command-test-files.php', ...$root], base_path());
        $check->run();

        return $check->getOutput();
    }
}
