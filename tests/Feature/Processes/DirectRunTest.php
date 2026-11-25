<?php

declare(strict_types=1);

namespace Tests\Feature\Processes;

use App\Api\Processes\AdmitLinePayload;
use App\Enums\Processes\ShellDialect;
use App\Models\CommandRules\CommandRequest;
use App\Models\Runs\ProcessRun;
use App\Values\AgentText;
use Illuminate\Testing\TestResponse;
use Tests\Support\Processes\RunsDirectLines;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\SendsSignedPayloads;
use Tests\Support\TestText;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A line an agent runs directly goes through the same admission as a hook: a refusal starts nothing and names its
 * request, an admitted line runs supervised and answers its output number and results.
 */
final class DirectRunTest extends TestCase
{
    use RefreshHookDatabase;
    use RunsDirectLines;
    use SendsSignedPayloads;

    public function test_an_unknown_line_is_refused_with_its_request_and_nothing_starts(): void
    {
        $reply = $this->admit('acme verify')->assertStatus(422);

        $this->assertSame('admission_refused', $reply->json('code'));
        $this->assertSame('command-unknown', $reply->json('details.reason_code'));
        $this->assertSame(TestText::words(AgentText::of('core.shell.nothing_started')), $reply->json('details.notice'));
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

        $first = $this->signed($this->start, $path, ['request_key' => 'take-1'])->json();
        $again = $this->signed($this->start, $path, ['request_key' => 'take-1'])->json();
        $other = $this->signed($this->start, $path, ['request_key' => 'take-2'])->json();
        ProcessRun::query()->withoutGlobalScopes()->findOrFail($runId)->recordHeartbeat();
        $afterStart = $this->signed($this->start, $path, ['request_key' => 'take-1'])->json();

        $this->assertSame('to_run', $first['state']);
        $this->assertSame($first['event_key'], $again['event_key']);
        $this->assertSame('already_started', $other['state']);
        $this->assertSame('already_started', $afterStart['state']);
    }

    #[TimeLimit(10, 'It admits and runs printf through the signed channel.')]
    public function test_process_run_line_refuses_or_runs_and_prints_its_output_number(): void
    {
        $this->runCommandsAs($this->start);

        $this->artisan('process:run', ['--line' => 'acme verify'])
            ->expectsOutputToContain('Nothing in this request started.')
            ->assertExitCode(1);
        $this->artisan('process:run', ['--line' => 'printf direct'])
            ->expectsOutputToContain('Output ')
            ->assertExitCode(0);
    }

    private function admit(string $line): TestResponse
    {
        $call = AdmitLinePayload::from([
            'line' => $line,
            'dialect' => ShellDialect::Bash,
            'workingFolder' => base_path(),
            'requestKey' => 'direct-1',
        ]);

        return $this->signed($this->start, '/agent/processes/admit', $call->toArray());
    }
}
