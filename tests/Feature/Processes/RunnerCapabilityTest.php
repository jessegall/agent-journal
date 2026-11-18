<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Processes\Contracts\ProcessRunner;
use App\Processes\Exceptions\OutputHiddenRefused;
use App\Processes\Exceptions\RunnerUnavailable;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessRun;
use App\Processes\Support\SpoolRecorder;
use App\Processes\Values\AdmittedRun;
use Illuminate\Support\Facades\Storage;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Fixtures\Processes\TestAdmissions;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\SendsSignedCalls;
use Tests\TestCase;

/**
 * The supervised runner starts nothing while its host capability is off, and with it on the demonstrations run with a
 * record, an own exit and full output per part (doc 21 revision 6, sections 53, 56 and 73).
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
        $this->runCommandsAs($this->launch->token);
        $this->folder = sys_get_temp_dir().'/runner-'.bin2hex(random_bytes(4));
        mkdir($this->folder);
        file_put_contents($this->folder.'/data.txt', "x one\ny two\nx three\n");
    }

    public function test_with_the_capability_off_nothing_starts(): void
    {
        $this->expectException(RunnerUnavailable::class);

        $this->runner()->start($this->admit('echo hi'));
    }

    public function test_a_check_whose_status_a_pipe_would_lose_is_refused_before_anything_starts(): void
    {
        config(['processes.runner' => true]);

        try {
            $this->runner()->start($this->admit('vendor/bin/phpstan analyse | grep error'));
            $this->fail('The piped check was started.');
        } catch (OutputHiddenRefused $refusal) {
            $this->assertStringContainsString('exit status', $refusal->getMessage());
        }
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
        $receipt = $this->runner()->start($this->admit($line));

        $this->artisan('process:run', ['--admission' => $receipt->runId])->assertExitCode(0);

        $this->assertSame($parts, PartRun::query()->where('process_run_id', $receipt->runId)->count());
    }

    private function runner(): ProcessRunner
    {
        return $this->app->make(ProcessRunner::class);
    }

    private function admit(string $line): AdmittedRun
    {
        return $this->app->make(TestAdmissions::class)->admit($line, $this->folder, new ActorIdentity(ActorType::Agent, $this->launch->agent->id));
    }
}
