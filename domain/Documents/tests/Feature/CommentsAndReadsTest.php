<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorContext;
use App\Agents\Enums\AgentRole;
use App\Agents\Models\Agent;
use App\Assignments\Support\Page;
use App\Bus\Contracts\CommandBus;
use App\Comments\Commands\PostComment;
use App\Comments\Commands\PostTextComment;
use App\Comments\Contracts\CommentResolver;
use App\Comments\Data\RecordCommentView;
use App\Comments\Data\TextCommentLocation;
use App\Comments\Data\TextCommentView;
use App\Comments\Enums\WholeRecord;
use App\Numbers\Support\RecordReference;
use App\Records\Contracts\RecordResolver;
use App\Records\Support\RecordIdentity;
use App\Text\Exceptions\AnchorMismatch;
use App\Text\Support\TextSelection;
use App\Text\Values\TextRange;
use Domain\Documents\Api\DraftReference;
use Domain\Documents\Api\DraftTarget;
use Domain\Documents\Commands\CloseDocument;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Commands\CreateReport;
use Domain\Documents\Commands\OpenDocument;
use Domain\Documents\Commands\ReplaceDocumentText;
use Domain\Documents\Contracts\DocumentResolver;
use Domain\Documents\Contracts\ReportResolver;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Exceptions\StaleRead;
use Domain\Documents\Tests\TestCase;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestIds;

/**
 * Users and agents comment on records through Core, on the whole record or on an exact quote of a revision; agents read records a bounded part at a
 * time and search the library literally.
 */
final class CommentsAndReadsTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = ['comments', 'agents', 'document_closes', 'document_drafts', 'reports', 'document_revisions', 'documents', 'number_groups'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of(1)));
        $this->bus()->run(new CreateDocument('Design', 'What we build', "# Goal\nShip the editor.\n\n## Risks\nNone.\n"));
    }

    public function test_a_user_comments_on_the_whole_document_and_on_an_exact_quote_without_changing_it(): void
    {
        $this->comment('Looks right.', WholeRecord::Record);
        $this->comment('Which editor?', TextRange::quote('1', 2, 2, 'the editor', 5, 15));

        $items = $this->comments()->list($this->document(), new Page())->items;

        $this->assertSame(['Looks right.', 'Which editor?'], array_map(fn ($item) => $item->comment->body, $items));
        $this->assertInstanceOf(RecordCommentView::class, $items[0]);
        $this->assertInstanceOf(TextCommentView::class, $items[1]);
        $this->assertSame(['1', 'the editor'], [$items[1]->anchor->versionId, $items[1]->anchor->quote]);
        $this->assertSame('1', $this->documents()->show(1)->revision);
    }

    public function test_section_and_line_comments_reopen_on_their_original_revision_after_a_newer_one(): void
    {
        $this->bus()->run(new CreateDocument('Sections', 'Three parts', "# One\nFirst.\n\n# Two\nSecond.\n\n# Three\nThird part.\nStill third.\n"));
        $section = $this->bus()->run(new PostTextComment($this->documentNumbered(2), 'About the third part.', TextRange::section('1', 3), (string) Str::uuid()));
        $lines = $this->bus()->run(new PostTextComment($this->documentNumbered(2), 'About these lines.', TextRange::lines('1', 2, 5), (string) Str::uuid()));
        $draft = $this->bus()->run(new OpenDocument(2));
        $draft = $this->bus()->run(new ReplaceDocumentText($this->target($draft), 'Third part.', 'A rewritten third part.'));
        $this->bus()->run(new CloseDocument($this->target($draft)));

        $sectionPlace = $this->comments()->location($this->documentNumbered(2), $section);
        $linesPlace = $this->comments()->location($this->documentNumbered(2), $lines);

        $this->assertInstanceOf(TextCommentLocation::class, $sectionPlace);
        $this->assertSame(['1', 3, 7, 10], [$sectionPlace->anchor->versionId, $sectionPlace->anchor->sectionNumber, $sectionPlace->part->firstLine, $sectionPlace->part->lastLine]);
        $this->assertStringContainsString('Third part.', $sectionPlace->part->text);
        $this->assertInstanceOf(TextCommentLocation::class, $linesPlace);
        $this->assertSame([2, 5], [$linesPlace->part->firstLine, $linesPlace->part->lastLine]);
    }

    public function test_a_quote_that_is_not_the_revision_text_is_refused_and_nothing_is_stored(): void
    {
        $this->expectException(AnchorMismatch::class);

        try {
            $this->comment('Hm.', TextRange::quote('1', 2, 2, 'the plan', 5, 13));
        } finally {
            $this->assertSame([], $this->comments()->list($this->document(), new Page())->items);
        }
    }

    public function test_an_agent_comments_as_itself(): void
    {
        $agent = Agent::named('Commenter', AgentRole::ReadOnlyHelper);
        $this->startRequestAs($agent->id, TestIds::of(9));

        $this->comment('From an agent.', WholeRecord::Record);

        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of(1)));
        $comment = $this->comments()->list($this->document(), new Page())->items[0]->comment;
        $this->assertSame([ActorType::Agent, $agent->id], [$comment->authorType, $comment->authorId]);
    }

    public function test_a_comment_with_a_script_shows_as_text(): void
    {
        $this->comment('<script>alert(1)</script>', WholeRecord::Record);

        $this->assertStringNotContainsString('<script>', $this->comments()->list($this->document(), new Page())->items[0]->comment->bodyHtml);
    }

    public function test_a_read_without_flags_gives_the_outline_and_a_long_section_is_cut_with_its_continuation(): void
    {
        $lines = implode("\n", array_map(fn (int $line) => "Line {$line}.", range(1, 300)));
        $this->bus()->run(new CreateDocument('Long', 'Many lines', "# Long\n{$lines}\n"));

        $outline = $this->documents()->read(2, new TextSelection());
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

    private function documents(): DocumentResolver
    {
        return $this->app->make(DocumentResolver::class);
    }

    private function reports(): ReportResolver
    {
        return $this->app->make(ReportResolver::class);
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }

    private function comment(string $body, WholeRecord|TextRange $subject): void
    {
        $this->bus()->run($subject instanceof TextRange ? new PostTextComment($this->document(), $body, $subject, (string) Str::uuid()) : new PostComment($this->document(), $body, (string) Str::uuid()));
    }

    private function document(): RecordIdentity
    {
        return $this->documentNumbered(1);
    }

    private function documentNumbered(int $number): RecordIdentity
    {
        return $this->app->make(RecordResolver::class)->identify(RecordReference::of('doc', $number));
    }

    private function comments(): CommentResolver
    {
        return $this->app->make(CommentResolver::class);
    }
}
