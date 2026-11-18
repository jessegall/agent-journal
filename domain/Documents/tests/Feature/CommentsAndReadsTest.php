<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Exceptions\UserActorRequired;
use App\Actors\Support\ActorContext;
use App\Bus\Contracts\CommandBus;
use Domain\Documents\Api\DraftReference;
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Commands\CloseDocument;
use Domain\Documents\Commands\CommentDocument;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Commands\CreateReport;
use Domain\Documents\Commands\OpenDocument;
use Domain\Documents\Commands\ReplaceDocumentText;
use Domain\Documents\Contracts\DocumentReader;
use Domain\Documents\Contracts\ReportReader;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Exceptions\AnchorMismatch;
use Domain\Documents\Exceptions\StaleRead;
use Domain\Documents\Models\RecordComment;
use Domain\Documents\Support\CommentAnchor;
use Domain\Documents\Support\TextSelection;
use Domain\Documents\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;

/**
 * Users comment on records, in general or on an exact quote of a revision; agents read records a bounded part at a
 * time and search the library literally.
 */
final class CommentsAndReadsTest extends TestCase
{
    use CommitsHookRows;

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = ['record_comments', 'document_closes', 'document_drafts', 'reports', 'document_revisions', 'documents', 'number_groups'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of(1)));
        $this->bus()->run(new CreateDocument('Design', 'What we build', "# Goal\nShip the editor.\n\n## Risks\nNone.\n"));
    }

    public function test_a_user_comments_generally_and_on_an_exact_quote_without_changing_the_document(): void
    {
        $this->bus()->run(new CommentDocument(1, 'Looks right.'));
        $this->bus()->run(new CommentDocument(1, 'Which editor?', new CommentAnchor(1, 'the editor', 2, 2, 5, 15)));

        $comments = $this->documents()->comments(1, 1);

        $this->assertSame(['Looks right.', 'Which editor?'], array_map(fn ($comment) => $comment->body, $comments));
        $this->assertSame(['1', 'the editor'], [$comments[1]->revision, $comments[1]->quote]);
        $this->assertSame('1', $this->documents()->show(1)->revision);
    }

    public function test_a_quote_that_is_not_the_revision_text_is_refused_and_nothing_is_stored(): void
    {
        $this->expectException(AnchorMismatch::class);

        try {
            $this->bus()->run(new CommentDocument(1, 'Hm.', new CommentAnchor(1, 'the plan', 2, 2, 5, 13)));
        } finally {
            $this->assertSame(0, RecordComment::query()->count());
        }
    }

    public function test_an_agent_cannot_comment(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forAgent(TestIds::of(9)));

        $this->expectException(UserActorRequired::class);

        try {
            $this->bus()->run(new CommentDocument(1, 'From an agent.'));
        } finally {
            $this->assertSame(0, RecordComment::query()->count());
        }
    }

    public function test_a_comment_with_a_script_shows_as_text(): void
    {
        $this->bus()->run(new CommentDocument(1, '<script>alert(1)</script>'));

        $this->assertStringNotContainsString('<script>', $this->documents()->comments(1, 1)[0]->bodyHtml);
    }

    public function test_a_read_without_flags_gives_the_outline_and_a_long_section_is_cut_with_its_continuation(): void
    {
        $lines = implode("\n", array_map(fn (int $line) => "Line {$line}.", range(1, 300)));
        $this->bus()->run(new CreateDocument('Long', 'Many lines', "# Long\n{$lines}\n"));

        $outline = $this->documents()->read(2, new TextSelection);
        $part = $this->documents()->read(2, new TextSelection(section: '1'));

        $this->assertSame(['1 Long (lines 1-302)'], $outline->outline);
        $this->assertSame('1-200', $part->lines);
        $this->assertSame('--lines 201- --at-revision 1', $part->continuation);
        $this->assertSame(200, count(explode("\n", (string) $part->text)));
    }

    public function test_a_continuation_after_a_new_revision_is_refused(): void
    {
        $draft = $this->bus()->run(new OpenDocument(1));
        $draft = $this->bus()->run(new ReplaceDocumentText($this->target($draft), 'None.', 'Late.'));
        $this->bus()->run(new CloseDocument($this->target($draft)));

        $this->expectException(StaleRead::class);

        $this->documents()->read(1, new TextSelection(firstLine: 2), expectedRevision: 1);
    }

    public function test_search_finds_a_body_phrase_with_its_revision_and_never_a_draft_or_a_wildcard(): void
    {
        $this->bus()->run(new CreateReport('Check', 'What we found', "Rates of 50%_off\n"));
        $draft = $this->bus()->run(new OpenDocument(1));
        $this->bus()->run(new ReplaceDocumentText($this->target($draft), 'None.', 'Only in the draft.'));

        $found = $this->documents()->list(new DocumentFilters(query: 'ship THE editor'));

        $this->assertSame(['revision 1'], array_map(fn ($row) => $row->foundIn, $found->rows));
        $this->assertStringContainsString('Ship the editor', (string) $found->rows[0]->snippet);
        $this->assertSame([], $this->documents()->list(new DocumentFilters(query: 'Only in the draft'))->rows);
        $this->assertCount(1, $this->reports()->list(new DocumentFilters(query: '%_'))->rows);
        $this->assertSame([], $this->reports()->list(new DocumentFilters(query: '0_o'))->rows);
    }

    public function test_paging_after_a_cursor_shows_every_older_row_once_while_rows_are_added(): void
    {
        foreach (range(2, 5) as $number) {
            $this->bus()->run(new CreateDocument("Doc {$number}", 'More', "Text\n"));
        }

        $first = $this->documents()->list(new DocumentFilters(perPage: 2));
        $this->bus()->run(new CreateDocument('Newer', 'Added while paging', "Text\n"));
        $second = $this->documents()->list(new DocumentFilters(perPage: 2, after: (string) $first->next));
        $third = $this->documents()->list(new DocumentFilters(perPage: 2, after: (string) $second->next));

        $this->assertSame(['5', '4', '3', '2', '1'], array_map(fn ($row) => $row->number, [...$first->rows, ...$second->rows, ...$third->rows]));
    }

    private function target(DraftReference $draft): DraftTarget
    {
        return new DraftTarget($draft->documentNumber, $draft->token, $draft->version);
    }

    private function documents(): DocumentReader
    {
        return $this->app->make(DocumentReader::class);
    }

    private function reports(): ReportReader
    {
        return $this->app->make(ReportReader::class);
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
