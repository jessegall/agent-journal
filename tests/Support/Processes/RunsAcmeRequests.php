<?php

declare(strict_types=1);

namespace Tests\Support\Processes;

use App\Commands\CommandRules\ApproveRuleProposal\ApproveRuleProposalCommand;
use App\Commands\CommandRules\ApproveSample\ApproveSampleCommand;
use App\Commands\CommandRules\OpenCommandRequest\OpenCommandRequestCommand;
use App\Commands\CommandRules\ProposeCommandRule\ProposeCommandRuleCommand;
use App\Commands\CommandRules\ProposeReader\ProposeReaderCommand;
use App\Commands\CommandRules\ProveReader\ProveReaderCommand;
use App\Commands\CommandRules\SettleSample\SettleSampleCommand;
use App\Commands\CommandRules\StartSample\StartSampleCommand;
use App\Enums\CommandRules\RequestHoldReason;
use App\Enums\Processes\OutputStream;
use App\Enums\Records\RecordRole;
use App\Enums\Runs\RunMode;
use App\Models\Agents\Agent;
use App\Models\CommandRules\CommandRequest;
use App\Models\CommandRules\RuleProposal;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Support\ActorReference;
use App\Support\OutputRecorder;
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
use Tests\Support\TestIds;
use Tests\Support\TestRunAdmissions;

/**
 * Walks an acme verify command request through its workflow in a test: an agent's request and declaration,
 * owner-approved samples that ended with a status and an output, the agent's reads, and a draft reader.
 */
trait RunsAcmeRequests
{
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
        $this->start = $this->journal->signedStart('Acme agent');
        $this->requestId = $this->journal->actAsAgentIds(
            $this->start->agent->id,
            $this->start->session->id,
        )->runUnkeyed(new OpenCommandRequestCommand(
            'acme verify',
            str_repeat('a', 64),
            'acme verify',
            sys_get_temp_dir(),
            RequestHoldReason::UnknownCommand,
        ));
        $this->journal->runAsStart(
            $this->start,
            new ProposeCommandRuleCommand($this->requestId, 'request-1', AcmeDeclarations::proposedVerify()),
        );
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

        return $this->journal->runAsStart(
            $this->start,
            new ProposeReaderCommand($this->requestId, 1, $definition),
        );
    }

    /**
     * One owner-approved sample that ended with the status and wrote the output, read by the agent when asked.
     */
    private function sample(int $status, string $output, bool $isRead): string
    {
        $permit = $this->journal->actAsUserId(TestIds::of(7))->runUnkeyed(new ApproveSampleCommand($this->requestId, 1, $this->request()->source_digest));
        $runId = $this->journal->runAsStart(
            $this->start,
            new StartSampleCommand($this->requestId, $permit, "sample-{$status}"),
        );
        $part = PartRun::create(
            ProcessRun::query()->withoutGlobalScopes()->findOrFail($runId),
            new PartKey(1, 1, 'acme verify'),
        );
        $part->start('host', 1);
        $recorder = $this->app->make(OutputRecorder::class);
        $recorder->append(new CapturedChunk($part, OutputStream::Stdout, $output, CarbonImmutable::now()));
        $part->finishProcess(PartEnd::exited($status));
        $part->finishDraining();
        $recorder->finish($part, PartEnd::exited($status));

        if ($isRead) {
            $this->journal->agentCall(
                $this->start,
                'POST',
                "/agent/processes/runs/{$runId}/output/summary",
                [],
            )->assertOk();
            $tail = ['part' => 1, 'stream' => 'stdout', 'lines' => 50];
            $this->journal->agentCall(
                $this->start,
                'POST',
                "/agent/processes/runs/{$runId}/output/tail",
                $tail,
            )->assertOk();
        }

        $this->journal->actAsAgentIds(
            $this->start->agent->id,
            $this->start->session->id,
        )->runUnkeyed(new SettleSampleCommand($this->requestId));

        return $runId;
    }

    private function request(): CommandRequest
    {
        return CommandRequest::query()->findOrFail($this->requestId);
    }

    private function approvePair(): void
    {
        $passed = $this->sample(0, self::PASSED_OUTPUT, isRead: true);
        $findings = $this->sample(1, self::FINDINGS_OUTPUT, isRead: true);
        $reader = $this->reader();
        $proof = $this->journal->runAsStart(
            $this->start,
            new ProveReaderCommand($this->requestId, $reader, [$passed, $findings]),
        );
        $approval = new OwnerApproval(1, 0, [new ReaderApproval($reader, $proof)], 'proven');

        $this->journal->actAsUserId(TestIds::of(7))->runUnkeyed(new ApproveRuleProposalCommand(RuleProposal::query()->sole()->id, $approval));
    }

    private function normalRun(int $status, string $output, RunMode $mode = RunMode::Normal): PartRun
    {
        $actor = ActorReference::ofClass(Agent::class, $this->start->agent->id);
        $run = ProcessRun::create($actor, TestRunAdmissions::of(mode: $mode));
        $part = PartRun::create($run, new PartKey(1, 1, 'acme verify'));
        $part->start('host', 1);
        $recorder = $this->app->make(OutputRecorder::class);
        $recorder->append(new CapturedChunk($part, OutputStream::Stdout, $output, CarbonImmutable::now()));
        $part->finishProcess(PartEnd::exited($status));
        $part->finishDraining();
        $recorder->finish($part, PartEnd::exited($status));

        return $part->refresh();
    }
}
