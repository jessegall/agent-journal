<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Bus\Contracts\CommandBus;
use App\Reads\Contracts\ReadMeter;
use App\Records\Exceptions\RecordUnavailable;
use App\Records\Support\RecordIdentity;
use App\Sharing\Enums\ShareRelationType;
use App\Sharing\Support\MeteredShareBudget;
use App\Sharing\Support\ShareContentRead;
use App\Sharing\Support\ShareRecordCard;
use App\Sharing\Support\ShareRecordDefinition;
use App\Sharing\Support\ShareRelationRead;
use App\Sharing\Support\ShareSelection;
use App\Sharing\Support\ShareTargetRead;
use App\Text\Exceptions\ContentTooLarge;
use App\Text\Support\MarkdownText;
use Carbon\CarbonImmutable;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\CreateReport\CreateReportCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\Commands\ReplaceDocumentBody\ReplaceDocumentBodyCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Models\Document;
use Domain\Documents\Models\Report;
use Domain\Documents\Support\DocumentShareProvider;
use Domain\Documents\Support\ReportShareProvider;
use Domain\Documents\Tests\TestCase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;

/**
 * Documents and reports as share records: a document with an open draft previews and reads its last closed revision,
 * a report reads its filed body, a body stored too large is refused before it is loaded, and unpublished or foreign
 * targets are ineligible.
 */
final class SharingTest extends TestCase
{
    use CommitsHookRows;

    private const string FOUND_TEXT = <<<'TEXT'
        # Found
        All good.

        TEXT;

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = [
        'comments',
        'links',
        'document_closes',
        'document_drafts',
        'reports',
        'document_revisions',
        'documents',
        'number_groups',
    ];

    private const string BODY = <<<'TEXT'
    # Goal
    Ship it.

    TEXT;

    private Document $document;

    private Report $report;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );

        $bus = $this->app->make(CommandBus::class);
        $bus->run(new CreateDocumentCommand('Design', 'What we build', self::BODY));

        $bus->run(new CreateReportCommand('Check', 'What we found', self::FOUND_TEXT));

        $draft = $bus->run(new OpenDocumentCommand('1'));

        $bus->run(
            new ReplaceDocumentBodyCommand(
                $draft->target(),
                <<<'TEXT'
                # Draft
                Not yet.

                TEXT,
            ),
        );

        $this->document = Document::query()->where('number', 1)->sole();
        $this->report = Report::query()->where('number', 1)->sole();
    }

    public function test_both_record_types_are_registered_with_the_linked_capability_and_owned_comments(): void
    {
        $aliases = array_map(
            fn (ShareRecordDefinition $definition) => [$definition->alias, $definition->capabilities],
            new DocumentsDomain()->shareRecords(),
        );

        $this->assertSame(
            [[Document::LINK_TYPE, ['share-linked-record']], [Report::LINK_TYPE, ['share-linked-record']]],
            $aliases,
        );

        $this->assertSame(ShareRelationType::Owned, Document::shareRelations()->find('comments')->get()->type);
        $this->assertSame('share-comment', Report::shareRelations()->find('comments')->get()->capability);
    }

    public function test_a_document_with_an_open_draft_previews_and_reads_its_last_closed_revision(): void
    {
        $documents = $this->app->make(DocumentShareProvider::class);
        $root = $this->document->shareIdentity();

        $card = $documents->preview(new ShareSelection($root, []), $this->budget());
        $content = $documents->content(new ShareContentRead($root), $this->budget());

        $this->assertTrue($documents->mayDisclose($root));
        $this->assertSame(['Design', '1'], [$card->title, $card->publicationVersion]);
        $this->assertSame(self::BODY, $content->body);
    }

    public function test_a_report_reads_its_filed_body(): void
    {
        $content = $this->app->make(ReportShareProvider::class)->content(
            new ShareContentRead($this->report->shareIdentity()),
            $this->budget(),
        );

        $this->assertSame(self::FOUND_TEXT, $content->body);

        $this->assertSame(['Check', '1'], [$content->card->title, $content->card->publicationVersion]);
    }

    public function test_a_body_stored_too_large_is_refused_before_it_is_loaded(): void
    {
        DB::table('reports')->where('id', $this->report->id)->update(
            ['body' => str_repeat('a', MarkdownText::BODY_BYTES + 1)],
        );

        $budget = $this->budget();

        $this->assertThrows(
            fn () => $this->app->make(ReportShareProvider::class)->content(
                new ShareContentRead($this->report->shareIdentity()),
                $budget,
            ),
            ContentTooLarge::class,
        );

        $this->assertSame(0, $budget->textBytes());
    }

    public function test_missing_and_foreign_targets_are_ineligible_and_a_missing_root_is_unavailable(): void
    {
        $documents = $this->app->make(DocumentShareProvider::class);
        $missing = new RecordIdentity(Document::LINK_TYPE, TestIds::of(77));

        $page = $documents->readTargets(
            new ShareTargetRead([], [$this->document->shareIdentity(), $missing, $this->report->shareIdentity()], null),
            $this->budget(),
        );

        $this->assertSame([$this->document->id], array_map(fn ($card) => $card->record->id, $page->eligible));
        $this->assertEquals([$missing, $this->report->shareIdentity()], $page->ineligible);
        $this->assertFalse($documents->mayDisclose($missing));

        $this->assertThrows(
            fn () => $documents->preview(new ShareSelection($missing, []), $this->budget()),
            RecordUnavailable::class,
        );
    }

    public function test_a_parent_with_1001_comments_pages_through_all_of_them(): void
    {
        $this->insertComments(array_map(fn (int $number) => ["Comment {$number}", null], range(1, 1001)));
        $documents = $this->app->make(DocumentShareProvider::class);
        $seen = [];
        $continuation = null;

        do {
            $page = $documents->readRelated(
                new ShareRelationRead($this->document->shareIdentity(), 'comments', 100, $continuation),
                $this->budget(),
            );

            array_push($seen, ...array_map(fn (ShareRecordCard $card) => $card->record->id, $page->eligible));
            $continuation = $page->continuation;
        } while ($continuation !== null);

        $this->assertCount(1001, array_unique($seen));
    }

    public function test_a_quote_no_longer_in_the_published_body_shows_the_label(): void
    {
        $this->insertComments([['Agreed', 'Ship it.'], ['Why?', 'Ship it slowly.'], ['Overall fine', null]]);

        $page = $this->app->make(DocumentShareProvider::class)->readRelated(
            new ShareRelationRead($this->document->shareIdentity(), 'comments', 50, null),
            $this->budget(),
        );

        $this->assertSame(
            ['Ship it.', ShareRecordCard::QUOTE_NOT_IN_VERSION, null],
            array_map(fn (ShareRecordCard $card) => $card->quote, $page->eligible),
        );

        $this->assertSame(
            ['Agreed', 'Why?', 'Overall fine'],
            array_map(fn (ShareRecordCard $card) => $card->excerpt, $page->eligible),
        );
    }

    /**
     * Comments on the document, a second apart in the given order, each a body with the quote it makes.
     *
     * @param  list<array{string, string|null}>  $comments
     */
    private function insertComments(array $comments): void
    {
        $now = CarbonImmutable::now();
        $rows = [];

        foreach ($comments as $position => [$body, $quote]) {
            $rows[] = [
                'id' => strtolower((string) Str::ulid()),
                'target_type' => Document::LINK_TYPE,
                'target_id' => $this->document->id,
                'author_type' => 'user',
                'author_id' => TestIds::of(1),
                'body' => $body,
                'quote' => $quote,
                'submission_key' => "key-{$position}",
                'submission_hash' => str_repeat('a', 64),
                'created_at' => $now->addSeconds($position),
            ];
        }

        foreach (array_chunk($rows, 500) as $chunk) {
            DB::table('comments')->insert($chunk);
        }
    }

    private function budget(): MeteredShareBudget
    {
        return MeteredShareBudget::forRead($this->app->make(ReadMeter::class));
    }
}
