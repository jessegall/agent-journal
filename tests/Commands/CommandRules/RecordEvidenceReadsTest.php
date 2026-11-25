<?php

declare(strict_types=1);

namespace Tests\Commands\CommandRules;

use App\Commands\CommandRules\OpenCommandRequest\OpenCommandRequestCommand;
use App\Commands\CommandRules\ProposeCommandRule\ProposeCommandRuleCommand;
use App\Enums\CommandRules\RequestHoldReason;
use App\Enums\Processes\OutputStream;
use App\Enums\Runs\RunMode;
use App\Models\Agents\Agent;
use App\Models\CommandRules\CommandRequest;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Support\ActorIdentity;
use App\Support\OutputRecorder;
use App\Values\CapturedChunk;
use App\Values\PartEnd;
use App\Values\PartKey;
use Carbon\CarbonImmutable;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\Processes\ProcessOutputDisk;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\SendsSignedPayloads;
use Tests\Support\StartsTestAgent;
use Tests\Support\TestRunAdmissions;
use Tests\TestCase;

/**
 * A sample's evidence counts as read only after its envelope and every written stream were read; stream reads without
 * the envelope do not count.
 */
final class RecordEvidenceReadsTest extends TestCase
{
    use RefreshHookDatabase;
    use SendsSignedPayloads;
    use StartsTestAgent;

    private const string OPERATION = 'acme verify';

    private CommandRequest $request;

    protected function setUp(): void
    {
        parent::setUp();

        ProcessOutputDisk::fake();
        $requestId = $this->runAsAgent(new OpenCommandRequestCommand(
            self::OPERATION,
            str_repeat('a', 64),
            self::OPERATION,
            '/projects/acme',
            RequestHoldReason::UnknownCommand,
        ));
        $this->runAsAgent(new ProposeCommandRuleCommand($requestId, 'request-1', AcmeDeclarations::proposedVerify()));
        $this->request = CommandRequest::query()->findOrFail($requestId);
    }

    public function test_the_evidence_counts_as_read_only_after_the_envelope_and_every_written_stream(): void
    {
        $run = $this->sampleRun();
        $this->assertFalse($this->request->hasReadEvidence($run));

        $this->readOutput($run, 'summary', []);
        $this->readOutput($run, 'tail', ['part' => 1, 'stream' => 'stdout', 'lines' => 5]);
        $this->assertFalse($this->request->hasReadEvidence($run));

        $this->readOutput($run, 'tail', ['part' => 1, 'stream' => 'stderr', 'lines' => 5]);
        $this->assertTrue($this->request->hasReadEvidence($run));
    }

    public function test_stream_reads_without_the_envelope_do_not_count(): void
    {
        $run = $this->sampleRun();

        $this->readOutput($run, 'tail', ['part' => 1, 'stream' => 'stdout', 'lines' => 5]);
        $this->readOutput($run, 'tail', ['part' => 1, 'stream' => 'stderr', 'lines' => 5]);

        $this->assertFalse($this->request->hasReadEvidence($run));
    }

    /**
     * @param  array<string, mixed>  $body
     */
    private function readOutput(ProcessRun $run, string $read, array $body): void
    {
        $this->signed($this->start, "/agent/processes/runs/{$run->id}/output/{$read}", $body)->assertOk();
    }

    private function sampleRun(): ProcessRun
    {
        $run = ProcessRun::create(
            ActorIdentity::ofClass(Agent::class, $this->start->agent->id),
            TestRunAdmissions::of(
                admissionId: 'sample',
                mode: RunMode::Evidence,
                projectKey: $this->request->project_key,
            ),
        );
        $part = PartRun::create($run, new PartKey(1, 1, self::OPERATION));
        $part->start('host', 1);
        $recorder = $this->app->make(OutputRecorder::class);
        $now = CarbonImmutable::now();
        $recorder->append(new CapturedChunk($part, OutputStream::Stdout, <<<'TEXT'
        ok first
        done 1 0

        TEXT, $now));
        $recorder->append(new CapturedChunk($part, OutputStream::Stderr, "warning\n", $now));
        $part->finishProcess(PartEnd::exited(0));
        $part->finishDraining();

        return $run;
    }
}
