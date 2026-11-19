<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Processes\Models\CommandRequest;
use App\Processes\Models\ProcessRun;
use App\Processes\Support\SpoolRecorder;
use Illuminate\Support\Facades\Storage;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\SendsSignedCalls;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A line an agent runs directly goes through the same admission as a hook: a refusal starts nothing and names its
 * request, an admitted line runs supervised and answers its output number and results (doc 21 revision 6, sections
 * 10, 53 and 71; stories 41, 79, 117, 119, 124 and 197).
 */
final class DirectRunTest extends TestCase
{
    use RefreshHookDatabase;
    use SendsSignedCalls;

    private TestLaunch $launch;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake(SpoolRecorder::DISK);
        config(['processes.runner' => true]);
        $this->launch = TestLaunch::start();
    }

    public function test_an_unknown_line_is_refused_with_its_request_and_nothing_starts(): void
    {
        $reply = $this->signed($this->launch, '/agent/processes/admit', $this->line('acme verify'))->assertOk();

        $this->assertFalse($reply->json('allowed'));
        $this->assertSame('command-unknown', $reply->json('code'));
        $this->assertSame('Nothing in this request started.', $reply->json('notice'));
        $this->assertSame(CommandRequest::query()->sole()->id, $reply->json('request_id'));
        $this->assertSame(0, ProcessRun::query()->withoutGlobalScopes()->count());
    }

    public function test_a_known_line_is_admitted_as_a_queued_run(): void
    {
        $reply = $this->signed($this->launch, '/agent/processes/admit', $this->line('cat composer.json'))->assertOk();

        $this->assertTrue($reply->json('allowed'));
        $this->assertSame($reply->json('run_id'), ProcessRun::query()->withoutGlobalScopes()->sole()->id);
    }

    #[TimeLimit(10, 'It admits and runs printf through the signed channel.')]
    public function test_process_run_line_refuses_or_runs_and_prints_its_output_number(): void
    {
        $this->runCommandsAs($this->launch);

        $this->artisan('process:run', ['--line' => 'acme verify'])
            ->expectsOutputToContain('Nothing in this request started.')
            ->assertExitCode(1);
        $this->artisan('process:run', ['--line' => 'printf direct'])
            ->expectsOutputToContain('Output ')
            ->assertExitCode(0);
    }

    /**
     * @return array<string, string>
     */
    private function line(string $line): array
    {
        return ['line' => $line, 'dialect' => 'bash', 'working_folder' => base_path(), 'request_id' => 'direct-1'];
    }
}
