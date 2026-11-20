<?php

declare(strict_types=1);

namespace Tests\Support\Processes;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Processes\Commands\ApproveRuleProposal;
use App\Processes\Commands\ApproveSample;
use App\Processes\Commands\OpenCommandRequest;
use App\Processes\Commands\ProposeCommandRule;
use App\Processes\Commands\ProposeReader;
use App\Processes\Commands\ProveReader;
use App\Processes\Commands\SettleSample;
use App\Processes\Commands\StartSample;
use App\Processes\Enums\OutputStream;
use App\Processes\Enums\RecordRole;
use App\Processes\Enums\RequestHoldReason;
use App\Processes\Enums\RunMode;
use App\Processes\Models\CommandRequest;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessRun;
use App\Processes\Models\RuleProposal;
use App\Processes\Support\SpoolRecorder;
use App\Processes\Values\CapturedChunk;
use App\Processes\Values\OwnerApproval;
use App\Processes\Values\PartEnd;
use App\Processes\Values\PartKey;
use App\Processes\Values\ReaderApproval;
use App\Processes\Values\ReaderDefinition;
use App\Processes\Values\RecordRule;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\Storage;
use Tests\Fixtures\Agents\TestStart;
use Tests\Fixtures\Processes\AcmeDeclarations;
use Tests\Support\ActsAsActors;
use Tests\Support\RunsCommandsAsStart;
use Tests\Support\TestRunAdmissions;

/**
 * Walks an acme verify command request through its workflow in a test: an agent's request and declaration,
 * owner-approved samples that ended with a status and an output, the agent's reads, and a draft reader.
 */
trait RunsAcmeRequests
{
    use ActsAsActors;
    use RunsCommandsAsStart;

    private const string PASSED_OUTPUT = <<<'TEXT'
    {"test":"a","status":"ok"}
    {"passed":1,"failed":0}

    TEXT;

    private const string FINDINGS_OUTPUT = <<<'TEXT'
    {"test":"a","status":"fail"}
    {"passed":0,"failed":1}

    TEXT;

    private TestStart $start;

    private string $requestId;

    private function openAcmeRequest(): void
    {
        Storage::fake(SpoolRecorder::DISK);
        $this->start = TestStart::start();
        $this->requestId = $this->runAsAgent(new OpenCommandRequest(
            'acme verify',
            str_repeat('a', 64),
            'acme verify',
            sys_get_temp_dir(),
            RequestHoldReason::UnknownCommand,
        ));
        $this->runAsAgent(new ProposeCommandRule($this->requestId, 'request-1', AcmeDeclarations::proposedVerify()));
    }

    /**
     * A draft reader for the acme verify output: one outcome rule per status and the summary with its failures.
     */
    private function reader(): string
    {
        $definition = new ReaderDefinition([
            RecordRule::of(RecordRole::Outcome, "test='{name:word}' status='ok'"),
            RecordRule::of(RecordRole::Outcome, "test='{name:word}' status='fail'"),
            RecordRule::of(RecordRole::Summary, 'passed={passed:int} failed={failed:int}'),
        ], failureField: 'failed');

        return $this->runAsAgent(new ProposeReader($this->requestId, 1, $definition));
    }

    /**
     * One owner-approved sample that ended with the status and wrote the output, read by the agent when asked.
     */
    private function sample(int $status, string $output, bool $read): string
    {
        $permit = $this->asUser(new ApproveSample($this->requestId, 1, $this->request()->source_digest));
        $runId = $this->runAsAgent(new StartSample($this->requestId, $permit, "sample-{$status}"));
        $part = PartRun::queue(
            ProcessRun::query()->withoutGlobalScopes()->findOrFail($runId),
            new PartKey(1, 1, 'acme verify'),
        );
        $part->start('host', 1);
        $recorder = $this->app->make(SpoolRecorder::class);
        $recorder->append(new CapturedChunk($part, OutputStream::Stdout, $output, CarbonImmutable::now()));
        $part->finishProcess(PartEnd::exited($status));
        $part->finishDraining();
        $recorder->finish($part, PartEnd::exited($status));

        if ($read) {
            $this->signed($this->start, "/agent/processes/runs/{$runId}/output/summary", [])->assertOk();
            $tail = ['part' => 1, 'stream' => 'stdout', 'lines' => 50];
            $this->signed($this->start, "/agent/processes/runs/{$runId}/output/tail", $tail)->assertOk();
        }
        $this->runAsAgent(new SettleSample($this->requestId));

        return $runId;
    }

    private function request(): CommandRequest
    {
        return CommandRequest::query()->findOrFail($this->requestId);
    }

    private function approvePair(): void
    {
        $passed = $this->sample(0, self::PASSED_OUTPUT, read: true);
        $findings = $this->sample(1, self::FINDINGS_OUTPUT, read: true);
        $reader = $this->reader();
        $proof = $this->runAsAgent(new ProveReader($this->requestId, $reader, [$passed, $findings]));
        $approval = new OwnerApproval(1, 0, [new ReaderApproval($reader, $proof)], 'proven');

        $this->asUser(new ApproveRuleProposal(RuleProposal::query()->sole()->id, $approval));
    }

    private function normalRun(int $status, string $output, RunMode $mode = RunMode::Normal): PartRun
    {
        $actor = new ActorIdentity(ActorType::Agent, $this->start->agent->id);
        $projectKey = (string) config('processes.project_key');
        $run = ProcessRun::admit($actor, TestRunAdmissions::of(mode: $mode, projectKey: $projectKey));
        $part = PartRun::queue($run, new PartKey(1, 1, 'acme verify'));
        $part->start('host', 1);
        $recorder = $this->app->make(SpoolRecorder::class);
        $recorder->append(new CapturedChunk($part, OutputStream::Stdout, $output, CarbonImmutable::now()));
        $part->finishProcess(PartEnd::exited($status));
        $part->finishDraining();
        $recorder->finish($part, PartEnd::exited($status));

        return $part->refresh();
    }
}
