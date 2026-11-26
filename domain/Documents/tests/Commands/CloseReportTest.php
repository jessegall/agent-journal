<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Commands;

use App\Contracts\Actors\IdentityLinks;
use App\Contracts\Bus\CommandBus;
use App\Exceptions\ActorNotAllowed;
use Domain\Comments\Models\Comment;
use Domain\Documents\Commands\AppendUpload\AppendUploadCommand;
use Domain\Documents\Commands\BeginUpload\BeginUploadCommand;
use Domain\Documents\Commands\CloseReport\CloseReportCommand;
use Domain\Documents\Commands\CommitUpload\CommitUploadCommand;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\CreateReport\CreateReportCommand;
use Domain\Documents\Contracts\Reports\ReportResolver;
use Domain\Documents\Enums\AttentionStatus;
use Domain\Documents\Enums\UploadType;
use Domain\Documents\Models\Report;
use Domain\Documents\Models\TextUpload;
use Domain\Documents\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;
use Tests\Support\TestProjects;

/**
 * An agent closes only the reports it created.
 */
#[TestsCommand(CloseReportCommand::class)]
final class CloseReportTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = [
        'record_settlements',
        'comments',
        'document_closes',
        'document_drafts',
        'reports',
        'document_revisions',
        'documents',
        'number_groups',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'command_receipts',
        'links',
        'text_uploads',
        'text_upload_chunks',
        'plans',
    ];

    private const string SETTLEMENT_REASON = 'The findings were addressed.';

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->actAsUserId(TestIds::of(1));

        $this->bus()->run(new CreateDocumentCommand('Design', 'What we build', <<<'TEXT'
        # Goal
        Ship it.

        TEXT, TestProjects::local()->id));
    }

    public function test_an_agent_settles_only_the_reports_it_created(): void
    {
        $this->journal->actAsAgentIds(TestIds::of(9), TestIds::of(90));
        $this->bus()->run(new CreateReportCommand('Check', 'What we found', "All good\n", TestProjects::local()->id));
        $this->bus()->run(new CloseReportCommand('1', 'Checked.'));
        $this->assertSame(AttentionStatus::Settled, Report::query()->sole()->attention);

        $this->journal->actAsUserId(TestIds::of(1));
        $this->bus()->run(new CreateReportCommand('Other', 'By a user', "Text\n", TestProjects::local()->id));
        $this->journal->actAsAgentIds(TestIds::of(8), TestIds::of(80));
        $this->expectException(ActorNotAllowed::class);

        $this->bus()->run(new CloseReportCommand('2', 'Not mine.'));
    }

    public function test_a_reviewer_files_links_comments_and_closes_without_changing_the_findings(): void
    {
        $writer = $this->journal->signedStart('Writer', 'writing-helper');
        $writer->startRequest($this->app);
        $bus = $this->app->make(CommandBus::class);

        $source = $bus->run(new CreateDocumentCommand(
            'Source',
            'Design under review.',
            'Published design.',
            TestProjects::local()->id,
        ));

        $reviewer = $this->journal->signedStart('Reader', 'read-only-helper');
        $reviewer->startRequest($this->app);
        $findings = str_pad('', 300 * 1024, 'Finding and evidence. ');

        $upload = $bus->run(
            new BeginUploadCommand(
                UploadType::ReportBody,
                strlen($findings),
                hash('sha256', $findings),
                TestProjects::local()->id,
            ),
        );

        foreach (str_split($findings, TextUpload::CHUNK_BYTES) as $index => $part) {
            $bus->run(new AppendUploadCommand($upload, $index, $part, hash('sha256', $part)));
        }

        $bus->run(new CommitUploadCommand($upload));

        $id = $this->journal->agentCall($reviewer, 'POST', '/agent/reports/make', [
            'title' => 'Review',
            'abstract' => 'Evidence and observations.',
            'upload_id' => $upload,
            'about' => ['doc '.$source->number],
            'request_key' => 'file-review',
        ])->assertOk()->json('id');

        $comment = [
            'report_id' => $id,
            'body' => 'Clarification on the first finding.',
            'request_key' => 'clarify-first-finding',
        ];

        $first = $this->journal->agentCall($reviewer, 'POST', '/agent/reports/comment', $comment)->assertOk()->json();

        $this->assertSame(
            $first,
            $this->journal->agentCall($reviewer, 'POST', '/agent/reports/comment', $comment)->assertOk()->json(),
        );

        $this->assertSame($comment['body'], Comment::query()->sole()->body);

        $this->journal->agentCall($reviewer, 'POST', '/agent/reports/close', [
            'number' => $id,
            'reason' => self::SETTLEMENT_REASON,
            'request_key' => 'close-review',
        ])->assertOk();

        $report = Report::query()->findOrFail($id);
        $this->assertSame($findings, $report->body);
        $this->assertSame(AttentionStatus::Settled, $report->attention);
        $this->assertSame($reviewer->agent->id, $report->creator_id);
        $links = $this->app->make(IdentityLinks::class);
        $this->assertSame([$source->id], array_column($links->linkedOfType($report, 'documents.document'), 'id'));

        $this->assertSame(
            [$reviewer->session->id],
            array_column($links->linkedOfType($report, 'core.agents.agent-session'), 'id'),
        );

        $reviewer->startRequest($this->app);
        $inspection = $this->app->make(ReportResolver::class)->inspect($report->number);
        $this->assertSame(self::SETTLEMENT_REASON, $inspection->settlements[0]->reason);
        $this->assertDatabaseCount('plans', 0);
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
