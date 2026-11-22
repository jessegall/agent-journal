<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Contracts\Bus\CommandBus;
use Domain\Documents\Commands\CloseDocument\CloseDocumentCommand;
use Domain\Documents\Commands\CloseReport\CloseReportCommand;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\CreateReport\CreateReportCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\Commands\ReplaceDocumentText\ReplaceDocumentTextCommand;
use Domain\Documents\Commands\SettleDocument\SettleDocumentCommand;
use Domain\Documents\Events\DocumentClosed;
use Domain\Documents\Events\DocumentCreated;
use Domain\Documents\Events\DocumentDraftSaved;
use Domain\Documents\Events\DocumentOpened;
use Domain\Documents\Events\DocumentPublished;
use Domain\Documents\Events\RecordSettled;
use Domain\Documents\Events\ReportFiled;
use Domain\Documents\Models\Document;
use Domain\Documents\Tests\TestCase;
use Illuminate\Contracts\Events\Dispatcher;
use Tests\Support\ActsAsActors;
use Tests\Support\CommitsHookRows;

/**
 * Each Documents row raises its own fact, released once after the command committed with the payload it had: a new
 * document, an opened and saved draft, a close and the publication it makes, a filed report and a settlement.
 */
final class DocumentFactsTest extends TestCase
{
    use ActsAsActors;
    use CommitsHookRows;

    private const array TABLES = [
        'record_settlements',
        'document_closes',
        'document_drafts',
        'reports',
        'document_revisions',
        'documents',
        'number_groups',
    ];

    /**
     * @var list<string>
     */
    private array $facts = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->actAsUser(1);
        $events = $this->app->make(Dispatcher::class);
        $plain = [DocumentCreated::class, DocumentOpened::class, ReportFiled::class, RecordSettled::class];
        $events->listen($plain, fn (object $fact) => $this->facts[] = class_basename($fact));

        $events->listen(
            DocumentDraftSaved::class,
            fn (DocumentDraftSaved $saved) => $this->facts[] = "DocumentDraftSaved v{$saved->version}",
        );

        $events->listen(
            DocumentClosed::class,
            fn (DocumentClosed $closed) => $this->facts[] = "DocumentClosed {$closed->revisionNumber}",
        );

        $events->listen(
            DocumentPublished::class,
            fn (DocumentPublished $published) => $this->facts[] = "DocumentPublished {$published->revisionNumber}",
        );
    }

    public function test_creating_editing_and_closing_a_document_raise_each_fact_once_in_order(): void
    {
        $this->bus()->run(new CreateDocumentCommand('Design', 'What we build', "# Goal\nShip it.\n"));
        $draft = $this->bus()->run(new OpenDocumentCommand('1'));
        $draft = $this->bus()->run(new ReplaceDocumentTextCommand($draft->target(), 'Ship it.', 'Ship it soon.'));
        $this->bus()->run(new CloseDocumentCommand($draft->target()));

        $this->assertSame([
            'DocumentCreated',
            'DocumentOpened',
            'DocumentDraftSaved v2',
            'DocumentClosed 2',
            'DocumentPublished 2',
        ], $this->facts);
    }

    public function test_an_unchanged_close_raises_no_publication(): void
    {
        $this->bus()->run(new CreateDocumentCommand('Design', 'What we build', "# Goal\nShip it.\n"));
        $draft = $this->bus()->run(new OpenDocumentCommand('1'));
        $this->facts = [];

        $this->bus()->run(new CloseDocumentCommand($draft->target()));

        $this->assertSame(['DocumentClosed 1'], $this->facts);
    }

    public function test_settling_twice_with_one_reason_and_filing_a_report_raise_one_fact_each(): void
    {
        $this->bus()->run(new CreateDocumentCommand('Design', 'What we build', "# Goal\nShip it.\n"));
        $this->bus()->run(new SettleDocumentCommand(1, 1, 'Shipped.'));
        $this->bus()->run(new SettleDocumentCommand(1, 1, 'Shipped.'));
        $this->bus()->run(new CreateReportCommand('Check', 'What we found', "All good\n"));
        $this->bus()->run(new CloseReportCommand('1', 'Read.'));

        $this->assertSame(
            ['DocumentCreated', 'RecordSettled', 'ReportFiled', 'RecordSettled'],
            $this->facts,
        );

        $this->assertCount(1, Document::query()->sole()->settlements());
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
