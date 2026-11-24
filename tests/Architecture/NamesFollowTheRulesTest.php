<?php

declare(strict_types=1);

namespace Tests\Architecture;

use PHPUnit\Framework\Attributes\DataProvider;
use Symfony\Component\Process\Process;
use Tests\TestCase;

/**
 * Every name of the project, in PHP, the frontend, the Go host, the shell scripts and the file names, follows the
 * naming rules of tools/refactoring/name-grammar.php and docs/naming/forbidden-words.txt (rule 99). Nothing is written
 * down as approved: the scan judges each name as it finds it.
 */
final class NamesFollowTheRulesTest extends TestCase
{
    private const string FIXTURE = 'tests/Fixtures/Architecture/Names';

    public function test_every_name_follows_the_naming_rules(): void
    {
        $scan = $this->scan();

        $this->assertSame(0, $scan->getExitCode(), $scan->getOutput().$scan->getErrorOutput());
    }

    /**
     * @return array<string, array{string}>
     */
    public static function faults(): array
    {
        return [
            'an action verb with a better word' => ['class ReportStop (%s): its verb report'],
            'a command in the third person' => ['method ReportStop::closes() (%s): a command is imperative: close, not closes'],
            'an action class without its verb' => ['class StepRunner (%s): an action class starts with its verb'],
            'a thing named for what will be done with it' => ['class PartToSpawn (%s): named for what will be done with it (part to spawn)'],
            'a yes or no that is no question' => ['property PartToSpawn::$retired (%s): a yes or no answer reads as a question'],
            'a getter' => ['method PartToSpawn::getStep() (%s): named for its answer, never get first'],
            'a forbidden word' => ['method PartToSpawn::underway() (%s): holds the forbidden underway'],
            'an event that does not say what happened' => ['class PartStart (%s): an event says what happened'],
            'a frontend purpose name' => ['variable accountToName (%s): named for what will be done with it (account to name)'],
            'a shell verb with a better word' => ['function report_stop (%s): its verb report'],
            'a shell function without its verb' => ['function architecture_of (%s): a shell function is verb_noun'],
            'a Go verb with a better word' => ['function reportStop (%s): its verb report'],
        ];
    }

    #[DataProvider('faults')]
    public function test_the_scan_finds_each_kind_of_fault(string $fault): void
    {
        $scan = $this->scan(self::FIXTURE);
        $pattern = '/'.str_replace('%s', '[^)]*', preg_quote($fault, '/')).'/';

        $this->assertSame(1, $scan->getExitCode());
        $this->assertMatchesRegularExpression($pattern, $scan->getOutput());
    }

    private function scan(string ...$paths): Process
    {
        $process = new Process([PHP_BINARY, 'tools/refactoring/name-faults.php', ...$paths], base_path(), timeout: 300);
        $process->run();

        return $process;
    }
}
