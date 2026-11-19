<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Processes\Calls\AdmitLineCall;
use App\Processes\Enums\ShellDialect;
use App\Processes\Models\CommandRequest;
use App\Processes\Models\ProcessRun;
use Illuminate\Testing\TestResponse;
use Tests\Support\Processes\RunsDirectLines;
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
    use RunsDirectLines;
    use SendsSignedCalls;

    public function test_an_unknown_line_is_refused_with_its_request_and_nothing_starts(): void
    {
        $reply = $this->admit('acme verify')->assertStatus(422);

        $this->assertSame('admission_refused', $reply->json('code'));
        $this->assertSame('command-unknown', $reply->json('details.reason_code'));
        $this->assertSame('Nothing in this request started.', $reply->json('details.notice'));
        $this->assertSame(CommandRequest::query()->sole()->id, $reply->json('details.request_id'));
        $this->assertSame(0, ProcessRun::query()->withoutGlobalScopes()->count());
    }

    public function test_a_known_line_is_admitted_as_a_queued_run(): void
    {
        $reply = $this->admit('cat composer.json')->assertOk();

        $this->assertSame($reply->json('run_id'), ProcessRun::query()->withoutGlobalScopes()->sole()->id);
    }

    public function test_a_lost_admission_answer_asked_again_under_its_key_starts_the_run_once(): void
    {
        $runId = $this->admit('cat composer.json')->json('run_id');
        $path = "/agent/processes/admissions/{$runId}";

        $first = $this->signed($this->launch, $path, ['request_key' => 'take-1'])->json();
        $again = $this->signed($this->launch, $path, ['request_key' => 'take-1'])->json();
        $other = $this->signed($this->launch, $path, ['request_key' => 'take-2'])->json();
        ProcessRun::query()->withoutGlobalScopes()->findOrFail($runId)->recordHeartbeat();
        $afterStart = $this->signed($this->launch, $path, ['request_key' => 'take-1'])->json();

        $this->assertSame('to_run', $first['state']);
        $this->assertSame($first['event_key'], $again['event_key']);
        $this->assertSame('already_started', $other['state']);
        $this->assertSame('already_started', $afterStart['state']);
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

    private function admit(string $line): TestResponse
    {
        $call = AdmitLineCall::from([
            'line' => $line,
            'dialect' => ShellDialect::Bash,
            'workingFolder' => base_path(),
            'requestKey' => 'direct-1',
        ]);

        return $this->signed($this->launch, '/agent/processes/admit', $call->toArray());
    }
}
