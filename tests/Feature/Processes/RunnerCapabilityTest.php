<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Processes\Contracts\ShellAdmission;
use App\Processes\Enums\RefusalCode;
use App\Processes\Enums\ShellDialect;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessRun;
use App\Processes\Support\SpoolRecorder;
use App\Processes\Values\Admission;
use App\Processes\Values\AdmissionRefusal;
use App\Processes\Values\ExecutionContext;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\SendsSignedCalls;
use Tests\TestCase;

/**
 * The shell admission starts nothing while the runner's host capability is off; with it on, each demonstration
 * process:run executes runs with a record, an own exit and full output per part (doc 21 revision 6, sections 53,
 * 56 and 73).
 */
final class RunnerCapabilityTest extends TestCase
{
    use RefreshHookDatabase;
    use SendsSignedCalls;

    private TestLaunch $launch;

    private string $folder;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake(SpoolRecorder::DISK);
        $this->launch = TestLaunch::start();
        $this->runCommandsAs($this->launch);
        $this->folder = sys_get_temp_dir().'/runner-'.bin2hex(random_bytes(4));
        mkdir($this->folder);
        file_put_contents($this->folder.'/data.txt', "x one\ny two\nx three\n");
    }

    public function test_with_the_capability_off_nothing_starts(): void
    {
        $refusal = $this->admit('echo hi')->decision;

        $this->assertInstanceOf(AdmissionRefusal::class, $refusal);
        $this->assertSame(RefusalCode::RunnerUnavailable, $refusal->code);
        $this->assertSame(0, ProcessRun::query()->withoutGlobalScopes()->count());
    }

    public function test_a_check_whose_status_a_pipe_would_lose_is_refused_before_anything_starts(): void
    {
        config(['processes.runner' => true]);

        $refusal = $this->admit('vendor/bin/phpstan analyse | grep error')->decision;

        $this->assertInstanceOf(AdmissionRefusal::class, $refusal);
        $this->assertSame(RefusalCode::OutputHidden, $refusal->code);
        $this->assertSame(0, ProcessRun::query()->withoutGlobalScopes()->count());
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
        $this->launch->startRequest($this->app);
        $context = ExecutionContext::inFolder($this->folder);
        $requestKey = bin2hex(random_bytes(8));

        return $this->app->make(ShellAdmission::class)->admit($line, ShellDialect::Bash, $context, $requestKey);
    }
}
