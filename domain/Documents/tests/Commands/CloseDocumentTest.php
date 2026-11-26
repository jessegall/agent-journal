<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Commands;

use App\Contracts\Bus\CommandBus;
use App\Events\Sessions\SessionClosed;
use Domain\Documents\Commands\ChangeDocumentDetails\ChangeDocumentDetailsCommand;
use Domain\Documents\Commands\CloseDocument\CloseDocumentCommand;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\EditDocument\EditDocumentCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\Commands\ReplaceDocumentText\ReplaceDocumentTextCommand;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\Enums\CloseCause;
use Domain\Documents\Events\DocumentClosed;
use Domain\Documents\Events\DocumentCreated;
use Domain\Documents\Events\DocumentDraftSaved;
use Domain\Documents\Events\DocumentOpened;
use Domain\Documents\Events\DocumentPublished;
use Domain\Documents\Events\RecordSettled;
use Domain\Documents\Events\ReportFiled;
use Domain\Documents\Listeners\CloseEndedSessionDraft;
use Domain\Documents\Models\DocumentClose;
use Domain\Documents\Models\DocumentDraft;
use Domain\Documents\Tests\TestCase;
use Illuminate\Contracts\Events\Dispatcher;
use Illuminate\Support\Facades\DB;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Exceptions\SimulatedFailure;
use Tests\Support\TestIds;
use Tests\Support\TestProjects;

/**
 * A close turns a draft's saves into exactly one next revision; an unchanged draft adds none, and a repeated close
 * returns the first outcome.
 */
#[TestsCommand(CloseDocumentCommand::class)]
final class CloseDocumentTest extends TestCase
{
    use CommitsHookRows;

    private const string RISKS_TEXT = <<<'TEXT'
        ## Risks
        Late.

        TEXT;

    private const string STEPS_TEXT = <<<'TEXT'
        ## Steps
        One.

        TEXT;

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = [
        'document_closes',
        'document_drafts',
        'reports',
        'document_revisions',
        'documents',
        'number_groups',
        'record_settlements',
        'comments',
    ];

    private const string BODY = <<<'TEXT'
    # Goal
    Ship it.

    ## Steps
    One.

    ## Risks
    None.

    TEXT;

    /**
     * @var list<string>
     */
    private array $facts = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->actAsUserId(TestIds::of(1));
        $this->bus()->run(new CreateDocumentCommand('Design', 'What we build', self::BODY, TestProjects::local()->id));
    }

    public function test_two_saves_close_into_exactly_one_next_revision(): void
    {
        $draft = $this->bus()->run(new OpenDocumentCommand('1'));

        $draft = $this->bus()->run(new EditDocumentCommand($draft->target(), '3', self::RISKS_TEXT));

        $draft = $this->bus()->run(new ChangeDocumentDetailsCommand($draft->target(), 'Design', 'What we build next'));
        $closed = $this->bus()->run(new CloseDocumentCommand($draft->target()));

        $this->assertSame(3, $draft->version);

        $this->assertSame([
            2,
            true,
        ], [
            $closed->revisionNumber,
            $closed->isPublished,
        ]);

        $this->assertStringContainsString(self::RISKS_TEXT, $this->documents()->show(1)->body);

        $this->assertStringContainsString(self::STEPS_TEXT, $this->documents()->show(1)->body);

        $this->assertSame(self::BODY, $this->documents()->revision(1, 1)->body);
        $this->assertTrue($this->documents()->revision(1, 1)->isHistorical);
        $this->assertCount(2, $this->documents()->revisions(1, 1));
        $this->assertSame(0, DocumentDraft::query()->count());
    }

    public function test_an_unchanged_draft_adds_no_revision_and_a_repeated_close_returns_the_first_outcome(): void
    {
        $draft = $this->bus()->run(new OpenDocumentCommand('1'));
        $draft = $this->bus()->run(new ReplaceDocumentTextCommand($draft->target(), 'One.', 'Two.'));
        $draft = $this->bus()->run(new ReplaceDocumentTextCommand($draft->target(), 'Two.', 'One.'));
        $first = $this->bus()->run(new CloseDocumentCommand($draft->target()));
        $repeated = $this->bus()->run(new CloseDocumentCommand($draft->target()));

        $this->assertSame([
            1,
            false,
        ], [
            $first->revisionNumber,
            $first->isPublished,
        ]);

        $this->assertEquals($first, $repeated);
        $this->assertSame(1, DocumentClose::query()->count());
        $this->assertSame('1', $this->documents()->show(1)->revision);
    }

    public function test_creating_editing_and_closing_a_document_raise_each_fact_once_in_order(): void
    {
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

        $this->bus()->run(new CreateDocumentCommand(
            'Design',
            'What we build',
            "# Goal\nShip it.\n",
            TestProjects::local()->id,
        ));

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

        $this->bus()->run(new CreateDocumentCommand(
            'Design',
            'What we build',
            "# Goal\nShip it.\n",
            TestProjects::local()->id,
        ));

        $draft = $this->bus()->run(new OpenDocumentCommand('1'));
        $this->facts = [];

        $this->bus()->run(new CloseDocumentCommand($draft->target()));

        $this->assertSame(['DocumentClosed 1'], $this->facts);
    }

    public function test_an_ended_session_closes_a_changed_draft_into_a_revision_and_an_unchanged_one_into_none(): void
    {
        $this->bus()->run(new CreateDocumentCommand('Design', 'What we build', <<<'TEXT'
        # Goal
        Ship it.
        TEXT, TestProjects::local()->id));

        $this->bus()->run(new CreateDocumentCommand('Notes', 'What we saw', "Text\n", TestProjects::local()->id));
        $this->journal->actAsAgentIds(TestIds::of(9), TestIds::of(90));
        $draft = $this->bus()->run(new OpenDocumentCommand('1'));
        $this->bus()->run(new ReplaceDocumentTextCommand($draft->target(), 'Ship it.', 'Shipped.'));
        $this->journal->actAsAgentIds(TestIds::of(8), TestIds::of(80));
        $this->bus()->run(new OpenDocumentCommand('2'));

        DB::transaction(fn () => $this->endSession(9, 90));
        DB::transaction(fn () => $this->endSession(8, 80));

        $this->assertSame(0, DocumentDraft::query()->count());

        $this->assertSame([
            '2',
            '1',
        ], [
            $this->documents()->show(1)->revision,
            $this->documents()->show(2)->revision,
        ]);

        $this->assertSame(
            [
                CloseCause::Lifecycle,
                CloseCause::Lifecycle,
            ],
            DocumentClose::query()->orderBy('closed_at')->get()->pluck('cause')->all(),
        );
    }

    public function test_a_failing_close_rolls_the_session_ending_back_and_keeps_the_draft(): void
    {
        $this->bus()->run(new CreateDocumentCommand('Design', 'What we build', <<<'TEXT'
        # Goal
        Ship it.
        TEXT, TestProjects::local()->id));

        $this->journal->actAsAgentIds(TestIds::of(9), TestIds::of(90));
        $draft = $this->bus()->run(new OpenDocumentCommand('1'));
        $this->bus()->run(new ReplaceDocumentTextCommand($draft->target(), 'Ship it.', 'Shipped.'));

        $this->assertThrows(
            fn () => DB::transaction(function (): void {
                $this->endSession(9, 90);

                throw SimulatedFailure::of('The ending failed.');
            }),
            SimulatedFailure::class,
        );

        $this->assertSame(1, DocumentDraft::query()->count());
        $this->assertSame(0, DocumentClose::query()->count());
    }

    private function documents(): DocumentResolver
    {
        return $this->app->make(DocumentResolver::class);
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }

    private function endSession(int $agent, int $session): void
    {
        $this->app->make(CloseEndedSessionDraft::class)
            ->handle(new SessionClosed(TestIds::of($agent), TestIds::of($session)));
    }
}
