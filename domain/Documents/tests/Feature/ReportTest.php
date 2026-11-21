<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Bus\Contracts\CommandBus;
use App\Comments\Models\Comment;
use App\Records\Contracts\IdentityLinks;
use Domain\Documents\Commands\AppendUpload;
use Domain\Documents\Commands\BeginUpload;
use Domain\Documents\Commands\CommitUpload;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Contracts\ReportResolver;
use Domain\Documents\Enums\AttentionState;
use Domain\Documents\Enums\UploadType;
use Domain\Documents\Models\Report;
use Domain\Documents\Models\TextUpload;
use Domain\Documents\Tests\TestCase;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\SendsSignedCalls;

final class ReportTest extends TestCase
{
    use CommitsHookRows;
    use SendsSignedCalls;

    private const array TABLES = [
        'agents', 'agent_sessions', 'start_tokens', 'agent_stacks', 'command_receipts', 'links', 'number_groups',
        'documents', 'document_revisions', 'record_settlements', 'reports', 'comments', 'text_uploads',
        'text_upload_chunks', 'plans',
    ];

    public function test_a_reviewer_files_links_comments_and_closes_without_changing_the_findings(): void
    {
        $writer = TestStart::start('writing-helper');
        $writer->startRequest($this->app);
        $bus = $this->app->make(CommandBus::class);
        $source = $bus->run(new CreateDocument('Source', 'Design under review.', 'Published design.'));

        $reviewer = TestStart::start('read-only-helper');
        $reviewer->startRequest($this->app);
        $findings = str_pad('', 300 * 1024, 'Finding and evidence. ');
        $upload = $bus->run(new BeginUpload(UploadType::ReportBody, strlen($findings), hash('sha256', $findings)));

        foreach (str_split($findings, TextUpload::CHUNK_BYTES) as $index => $part) {
            $bus->run(new AppendUpload($upload, $index, $part, hash('sha256', $part)));
        }

        $bus->run(new CommitUpload($upload));

        $id = $this->signed($reviewer, '/agent/reports/make', [
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

        $first = $this->signed($reviewer, '/agent/reports/comment', $comment)->assertOk()->json();
        $this->assertSame($first, $this->signed($reviewer, '/agent/reports/comment', $comment)->assertOk()->json());
        $this->assertSame($comment['body'], Comment::query()->sole()->body);

        $this->signed($reviewer, '/agent/reports/close', [
            'number' => $id,
            'reason' => 'The findings were addressed.',
            'request_key' => 'close-review',
        ])->assertOk();

        $report = Report::query()->findOrFail($id);
        $this->assertSame($findings, $report->body);
        $this->assertSame(AttentionState::Settled, $report->attention);
        $this->assertSame($reviewer->agent->id, $report->creator_id);
        $links = $this->app->make(IdentityLinks::class);
        $this->assertSame([$source->id], array_column($links->linkedOfType($report, 'documents.document'), 'id'));

        $this->assertSame(
            [$reviewer->session->id],
            array_column($links->linkedOfType($report, 'core.agent-session'), 'id'),
        );

        $reviewer->startRequest($this->app);
        $inspection = $this->app->make(ReportResolver::class)->inspect($report->number);
        $this->assertSame('The findings were addressed.', $inspection->settlements[0]->reason);
        $this->assertDatabaseCount('plans', 0);
    }
}
