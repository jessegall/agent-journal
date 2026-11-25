<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Contracts\Actors\IdentityLinks;
use App\Contracts\Bus\CommandBus;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\CreateReport\CreateReportCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\Contracts\Drafts\DraftResolver;
use Domain\Documents\Contracts\Reports\ReportResolver;
use Domain\Documents\Exceptions\DraftMissing;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\DocumentRevision;
use Domain\Documents\Models\Report;
use Domain\Documents\Tests\TestCase;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;

final class DocumentRecordsTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const string PUBLIC_TEXT = 'Public text.';

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'command_receipts',
        'links',
        'document_closes',
        'document_drafts',
        'document_revisions',
        'documents',
        'reports',
        'number_groups',
    ];

    public function test_published_records_are_shared_and_draft_text_belongs_to_the_author_session(): void
    {
        $author = TestStart::start();
        $reader = TestStart::start();
        $author->startRequest($this->app);
        $bus = $this->app->make(CommandBus::class);
        $document = $bus->run(new CreateDocumentCommand('Design', 'Current design.', self::PUBLIC_TEXT));
        $report = $bus->run(new CreateReportCommand('Evidence', 'First run.', 'Filed text.'));
        $bus->run(new OpenDocumentCommand((string) $document->number));

        $links = $this->app->make(IdentityLinks::class);

        foreach ([
            Document::query()->sole(),
            DocumentRevision::query()->sole(),
            Report::query()->sole(),
        ] as $record) {
            $origins = $links->linkedOfType($record, 'core.agents.agent-session');
            $this->assertSame([$author->session->id], array_column($origins, 'id'));
        }

        $this->assertSame(self::PUBLIC_TEXT, trim(
            $this->app->make(DraftResolver::class)->current($document->number)->body,
        ));

        $reader->startRequest($this->app);
        $this->assertSame('Design', $this->app->make(DocumentResolver::class)->show($document->number)->title);
        $this->assertSame('Evidence', $this->app->make(ReportResolver::class)->show($report->number)->title);

        $this->assertThrows(
            fn () => $this->app->make(DraftResolver::class)->current($document->number),
            DraftMissing::class,
        );

        $this->startRequestAs($author->agent->id, $reader->session->id);

        $this->assertThrows(
            fn () => $this->app->make(DraftResolver::class)->current($document->number),
            DraftMissing::class,
        );
    }
}
