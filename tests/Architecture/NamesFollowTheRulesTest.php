<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Illuminate\Support\Facades\File;
use PHPUnit\Framework\Attributes\DataProvider;
use Symfony\Component\Process\Process;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * Every name of the project, in PHP, the frontend, the Go host, the shell scripts and the file names, follows the
 * naming rules of tools/refactoring/name-grammar.php and docs/naming/forbidden-words.txt (rule 99). Nothing is written
 * down as approved: the scan judges each name as it finds it.
 */
final class NamesFollowTheRulesTest extends TestCase
{
    private const string FIXTURE = 'tests/Fixtures/Architecture/Names';

    #[TimeLimit(seconds: 60, reason: 'It reads every name of the project, PHP, frontend, Go and shell, fresh.')]
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
            'an action class without its verb' => ['class LedgerRunner (%s): an action class starts with its verb'],
            'a thing named for what will be done with it' => ['class PartToSpawn (%s): named for what will be done with it (part to spawn)'],
            'a yes or no that is no question' => ['property PartToSpawn::$retired (%s): a yes or no answer reads as a question'],
            'a getter' => ['method PartToSpawn::getStep() (%s): named for its answer, never get first'],
            'a forbidden word' => ['method PartToSpawn::underway() (%s): holds the forbidden underway'],
            'an event that does not say what happened' => ['class PartStart (%s): an event says what happened'],
            'a state named with the gerund' => ['class ReadingLedgerState (%s): a state says what the agent is to do with the plain verb, not reading'],
            'a frontend purpose name' => ['variable ledgerToCheck (%s): named for what will be done with it (ledger to check)'],
            'a shell verb with a better word' => ['function report_stop (%s): its verb report'],
            'a shell function without its verb' => ['function ledger_of (%s): a shell function is verb_noun'],
            'a Go verb with a better word' => ['function reportStop (%s): its verb report'],
        ];
    }

    #[DataProvider('faults')]
    public function test_the_scan_finds_each_kind_of_fault(string $fault): void
    {
        $scan = $this->scan([self::FIXTURE]);
        $pattern = '/'.str_replace('%s', '[^)]*', preg_quote($fault, '/')).'/';

        $this->assertSame(1, $scan->getExitCode());
        $this->assertMatchesRegularExpression($pattern, $scan->getOutput());
    }

    public function test_a_staged_scan_judges_only_the_staged_files(): void
    {
        $staged = 'tests/Fixtures/StagedNames/StepToRun.php';
        $this->beforeApplicationDestroyed(fn () => File::deleteDirectory(base_path(dirname($staged))));
        File::ensureDirectoryExists(base_path(dirname($staged)));
        File::put(base_path($staged), "<?php\n\nnamespace Tests\\Fixtures\\StagedNames;\n\nfinal class StepToRun {}\n");

        $scan = $this->scan(['--staged'], environment: ['GIT_INDEX_FILE' => $this->indexStaging($staged)]);

        $this->assertSame(1, $scan->getExitCode(), $scan->getOutput().$scan->getErrorOutput());
        $this->assertStringContainsString('class StepToRun', $scan->getOutput());
        $this->assertStringNotContainsString('PartToSpawn', $scan->getOutput());
    }

    public function test_a_staged_fixture_of_faults_kept_on_purpose_still_commits(): void
    {
        $scan = $this->scan(['--staged'], environment: ['GIT_INDEX_FILE' => $this->indexStaging(self::FIXTURE.'/PartToSpawn.php')]);

        $this->assertSame(0, $scan->getExitCode(), $scan->getOutput().$scan->getErrorOutput());
    }

    public function test_a_staged_scan_with_nothing_staged_passes(): void
    {
        $scan = $this->scan(['--staged'], environment: ['GIT_INDEX_FILE' => $this->indexStaging()]);

        $this->assertSame(0, $scan->getExitCode(), $scan->getOutput().$scan->getErrorOutput());
    }

    #[TimeLimit(seconds: 60, reason: 'It reads every name of the project to learn its words.')]
    public function test_the_learned_words_are_written_for_the_scans_of_part_of_the_code(): void
    {
        $scan = $this->scan(['--vocabulary']);
        $words = json_decode((string) file_get_contents(base_path('storage/names/vocabulary.json')), true, 4, JSON_THROW_ON_ERROR);

        $this->assertSame(0, $scan->getExitCode(), $scan->getErrorOutput());
        $this->assertSame(['verbs', 'commandVerbs', 'nouns', 'sharedVerbs', 'happenings', 'typeNames'], array_keys($words));
        $this->assertContains('notify', $words['verbs']);
        $this->assertContains('NameVocabulary', $words['typeNames']);
    }

    /**
     * An index of its own, holding HEAD with each file given staged as changed, so the project's own index is untouched.
     */
    private function indexStaging(string ...$files): string
    {
        $index = tempnam(sys_get_temp_dir(), 'names-index');
        $git = fn (string ...$arguments) => new Process(['git', ...$arguments], base_path(), ['GIT_INDEX_FILE' => $index])->mustRun();
        $git('read-tree', 'HEAD');

        foreach ($files as $file) {
            $changed = trim(new Process(['git', 'hash-object', '-w', '--stdin'], base_path())->setInput("<?php\n")->mustRun()->getOutput());
            $git('update-index', '--add', '--cacheinfo', "100644,{$changed},{$file}");
        }

        return $index;
    }

    /**
     * @param  list<string>  $arguments
     * @param  array<string, string>  $environment
     */
    private function scan(array $arguments = [], array $environment = []): Process
    {
        $process = new Process([PHP_BINARY, 'tools/refactoring/name-faults.php', ...$arguments], base_path(), $environment, timeout: 300);
        $process->run();

        return $process;
    }
}
