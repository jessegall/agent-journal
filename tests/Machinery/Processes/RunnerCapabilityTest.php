<?php

declare(strict_types=1);

namespace Tests\Machinery\Processes;

use App\Access\Contracts\ShellAdmission;
use App\Access\Values\Admission;
use App\Models\Runs\PartRun;
use App\Processes\Enums\ShellDialect;
use App\Values\ExecutionContext;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\Processes\ProcessOutputDisk;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The shell admission starts nothing while the runner's host capability is off; with it on, each demonstration
 * process:run executes runs with a record, an own exit and full output per part.
 */
#[TestsMachinery(ShellAdmission::class)]
final class RunnerCapabilityTest extends TestCase
{
    use RefreshHookDatabase;

    private TestStart $start;

    private string $folder;

    protected function setUp(): void
    {
        parent::setUp();

        ProcessOutputDisk::fake();
        $this->start = $this->journal->signedStart('Main agent', 'main-agent');
        $this->journal->relayAgentCommands($this->start);
        $this->folder = sys_get_temp_dir().'/runner-'.bin2hex(random_bytes(4));
        mkdir($this->folder);
        file_put_contents($this->folder.'/data.txt', <<<'TEXT'
        x one
        y two
        x three

        TEXT);
    }

    /**
     * @return iterable<string, array{string, int}>
     */
    public static function demonstrations(): iterable
    {
        yield 'a sequence' => ['false; echo after', 2];

        yield 'and and or with a failing first part' => ['false && echo skipped || echo recovered', 3];

        yield 'a two-stage data pipeline' => ['cat data.txt | grep x', 2];

        yield 'a lowered sh -c' => ["sh -c 'echo a; echo b'", 2];

        yield 'a command substitution' => ['echo $(echo inner)', 2];
    }

    #[DataProvider('demonstrations')]
    public function test_each_demonstration_records_its_parts(string $line, int $parts): void
    {
        config(['processes.runner' => true]);
        $admission = $this->admit($line);
        $this->assertTrue($admission->isAllowed());

        $this->artisan('process:run', ['--admission' => $admission->runId])->assertExitCode(0);

        $this->assertSame($parts, PartRun::query()->where('process_run_id', $admission->runId)->count());
    }

    private function admit(string $line): Admission
    {
        $this->start->startRequest($this->app);
        $context = ExecutionContext::inFolder($this->folder);
        $requestKey = bin2hex(random_bytes(8));

        return $this->app->make(ShellAdmission::class)->admit($line, ShellDialect::Bash, $context, $requestKey);
    }
}
