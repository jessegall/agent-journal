<?php

declare(strict_types=1);

namespace Tests\Support\Processes;

use App\Commands\ApproveRuleProposal\ApproveRuleProposalCommand;
use App\Commands\ApproveSample\ApproveSampleCommand;
use App\Commands\OpenCommandRequest\OpenCommandRequestCommand;
use App\Commands\ProposeCommandRule\ProposeCommandRuleCommand;
use App\Commands\ProposeReader\ProposeReaderCommand;
use App\Commands\ProveReader\ProveReaderCommand;
use App\Commands\SettleSample\SettleSampleCommand;
use App\Commands\StartSample\StartSampleCommand;
use App\Enums\ActorType;
use App\Enums\OutputStream;
use App\Enums\RecordRole;
use App\Enums\RequestHoldReason;
use App\Enums\RunMode;
use App\Models\CommandRules\CommandRequest;
use App\Models\CommandRules\RuleProposal;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Support\ActorIdentity;
use App\Support\SpoolRecorder;
use App\Values\CapturedChunk;
use App\Values\OwnerApproval;
use App\Values\PartEnd;
use App\Values\PartKey;
use App\Values\ReaderApproval;
use App\Values\ReaderDefinition;
use App\Values\RecordRule;
use Carbon\CarbonImmutable;
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
        ProcessOutputDisk::fake();
        $this->start = TestStart::start();
        $this->requestId = $this->runAsAgent(new OpenCommandRequestCommand(
            'acme verify',
            str_repeat('a', 64),
            'acme verify',
            sys_get_temp_dir(),
            RequestHoldReason::UnknownCommand,
        ));
        $this->runAsAgent(new ProposeCommandRuleCommand($this->requestId, 'request-1', AcmeDeclarations::proposedVerify()));
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

        return $this->runAsAgent(new ProposeReaderCommand($this->requestId, 1, $definition));
    }

    /**
     * One owner-approved sample that ended with the status and wrote the output, read by the agent when asked.
     */
    private function sample(int $status, string $output, bool $isRead): string
    {
        $permit = $this->asUser(new ApproveSampleCommand($this->requestId, 1, $this->request()->source_digest));
        $runId = $this->runAsAgent(new StartSampleCommand($this->requestId, $permit, "sample-{$status}"));
        $part = PartRun::create(
            ProcessRun::query()->withoutGlobalScopes()->findOrFail($runId),
            new PartKey(1, 1, 'acme verify'),
        );
        $part->start('host', 1);
        $recorder = $this->app->make(SpoolRecorder::class);
        $recorder->append(new CapturedChunk($part, OutputStream::Stdout, $output, CarbonImmutable::now()));
        $part->finishProcess(PartEnd::exited($status));
        $part->finishDraining();
        $recorder->finish($part, PartEnd::exited($status));

        if ($isRead) {
            $this->signed($this->start, "/agent/processes/runs/{$runId}/output/summary", [])->assertOk();
            $tail = ['part' => 1, 'stream' => 'stdout', 'lines' => 50];
            $this->signed($this->start, "/agent/processes/runs/{$runId}/output/tail", $tail)->assertOk();
        }

        $this->runAsAgent(new SettleSampleCommand($this->requestId));

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
        $proof = $this->runAsAgent(new ProveReaderCommand($this->requestId, $reader, [$passed, $findings]));
        $approval = new OwnerApproval(1, 0, [new ReaderApproval($reader, $proof)], 'proven');

        $this->asUser(new ApproveRuleProposalCommand(RuleProposal::query()->sole()->id, $approval));
    }

    private function normalRun(int $status, string $output, RunMode $mode = RunMode::Normal): PartRun
    {
        $actor = new ActorIdentity(ActorType::Agent, $this->start->agent->id);
        $projectKey = (string) config('processes.project_key');
        $run = ProcessRun::create($actor, TestRunAdmissions::of(mode: $mode, projectKey: $projectKey));
        $part = PartRun::create($run, new PartKey(1, 1, 'acme verify'));
        $part->start('host', 1);
        $recorder = $this->app->make(SpoolRecorder::class);
        $recorder->append(new CapturedChunk($part, OutputStream::Stdout, $output, CarbonImmutable::now()));
        $part->finishProcess(PartEnd::exited($status));
        $part->finishDraining();
        $recorder->finish($part, PartEnd::exited($status));

        return $part->refresh();
    }
}
