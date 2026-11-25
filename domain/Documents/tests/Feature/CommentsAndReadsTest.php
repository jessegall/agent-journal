<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Records\RecordResolver;
use App\Exceptions\AnchorMismatch;
use App\Models\Agents\Agent;
use App\Support\ActorContext;
use App\Support\IdListPage;
use App\Support\RecordIdentity;
use App\Support\RecordReference;
use App\Support\TextSelection;
use App\Values\OwnerAuthority;
use App\Values\TextRange;
use Domain\Comments\Commands\PostComment\PostCommentCommand;
use Domain\Comments\Commands\PostTextComment\PostTextCommentCommand;
use Domain\Comments\Contracts\CommentResolver;
use Domain\Comments\Data\RecordCommentView;
use Domain\Comments\Data\TextCommentLocation;
use Domain\Comments\Data\TextCommentView;
use Domain\Comments\Enums\WholeRecord;
use Domain\Documents\Commands\CloseDocument\CloseDocumentCommand;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\CreateReport\CreateReportCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\Commands\ReplaceDocumentText\ReplaceDocumentTextCommand;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\Contracts\Reports\ReportResolver;
use Domain\Documents\Data\DocumentFilters;
use Domain\Documents\Exceptions\StaleRead;
use Domain\Documents\Tests\TestCase;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestIds;

/**
 * Users and agents comment on records through Core, on the whole record or on an exact quote of a revision; agents read
 * records a bounded part at a
 * time and search the library literally.
 */
final class CommentsAndReadsTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const string THIRD_PART = 'Third part.';

    private const string CONTINUATION = '--lines 201- --at-revision 1';

    private const string SHIPPED_PHRASE = 'Ship the editor';

    /**
     * The bus commits these commands for real, so these tables are emptied around each test.
     */
    private const array TABLES = [
        'comments',
        'agents',
        'document_closes',
        'document_drafts',
        'reports',
        'document_revisions',
        'documents',
        'number_groups',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );

        $this->bus()->run(
            new CreateDocumentCommand('Design', 'What we build', <<<'TEXT'
            # Goal
            Ship the editor.

            ## Risks
            None.

            TEXT),
        );
    }

    public function test_a_user_comments_on_the_whole_document_and_on_an_exact_quote_without_changing_it(): void
    {
        $this->comment('Looks right.', WholeRecord::Record);
        $this->comment('Which editor?', TextRange::quote('1', 2, 2, 'the editor', 5, 15));

        $items = $this->comments()->list($this->document(), new IdListPage())->comments;

        $this->assertSame([
            'Looks right.',
            'Which editor?',
        ], array_map(fn ($item) => $item->comment->body, $items));
        $this->assertInstanceOf(RecordCommentView::class, $items[0]);
        $this->assertInstanceOf(TextCommentView::class, $items[1]);
        $this->assertSame([
            '1',
            'the editor',
        ], [
            $items[1]->anchor->versionId,
            $items[1]->anchor->quote,
        ]);
        $this->assertSame('1', $this->documents()->show(1)->revision);
    }

    public function test_section_and_line_comments_reopen_on_their_original_revision_after_a_newer_one(): void
    {
        $this->bus()->run(
            new CreateDocumentCommand(
                'Sections',
                'Three parts',
                <<<'TEXT'
                # One
                First.

                # Two
                Second.

                # Three
                Third part.
                Still third.

                TEXT,
            ),
        );

        $section = $this->bus()->run(
            new PostTextCommentCommand(
                $this->documentNumbered(2),
                'About the third part.',
                TextRange::section('1', 3),
                (string) Str::uuid(),
            ),
        );

        $lines = $this->bus()->run(
            new PostTextCommentCommand(
                $this->documentNumbered(2),
                'About these lines.',
                TextRange::lines('1', 2, 5),
                (string) Str::uuid(),
            ),
        );

        $draft = $this->bus()->run(new OpenDocumentCommand('2'));

        $draft = $this->bus()->run(
            new ReplaceDocumentTextCommand($draft->target(), self::THIRD_PART, 'A rewritten third part.'),
        );

        $this->bus()->run(new CloseDocumentCommand($draft->target()));

        $sectionPlace = $this->comments()->location($this->documentNumbered(2), $section);
        $linesPlace = $this->comments()->location($this->documentNumbered(2), $lines);

        $this->assertInstanceOf(TextCommentLocation::class, $sectionPlace);

        $this->assertSame(
            [
                '1',
                3,
                7,
                10,
            ],
            [
                $sectionPlace->anchor->versionId,
                $sectionPlace->anchor->sectionNumber,
                $sectionPlace->part->firstLine,
                $sectionPlace->part->lastLine,
            ],
        );

        $this->assertStringContainsString(self::THIRD_PART, $sectionPlace->part->text);
        $this->assertInstanceOf(TextCommentLocation::class, $linesPlace);
        $this->assertSame([
            2,
            5,
        ], [
            $linesPlace->part->firstLine,
            $linesPlace->part->lastLine,
        ]);
    }

    public function test_a_quote_that_is_not_the_revision_text_is_refused_and_nothing_is_stored(): void
    {
        $this->expectException(AnchorMismatch::class);

        try {
            $this->comment('Hm.', TextRange::quote('1', 2, 2, 'the plan', 5, 13));
        } finally {
            $this->assertSame([], $this->comments()->list($this->document(), new IdListPage())->comments);
        }
    }

    public function test_an_agent_comments_as_itself(): void
    {
        $agent = Agent::create('Commenter', 'read-only-helper');
        $this->startRequestAs($agent->id, TestIds::of(9));

        $this->comment('From an agent.', WholeRecord::Record);

        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser(TestIds::of(1)),
            new OwnerAuthority('test'),
        );

        $comment = $this->comments()->list($this->document(), new IdListPage())->comments[0]->comment;
        $this->assertSame([
            Agent::storedType(),
            $agent->id,
        ], [
            $comment->authorType,
            $comment->authorId,
        ]);
    }

    public function test_a_comment_with_a_script_shows_as_text(): void
    {
        $this->comment('<script>alert(1)</script>', WholeRecord::Record);

        $this->assertStringNotContainsString(
            '<script>',
            $this->comments()->list($this->document(), new IdListPage())->comments[0]->comment->bodyHtml,
        );
    }

    public function test_a_read_without_flags_gives_the_outline_and_a_long_section_is_cut_with_its_continuation(): void
    {
        $lines = implode("\n", array_map(fn (int $line) => "Line {$line}.", range(1, 300)));

        $this->bus()->run(new CreateDocumentCommand('Long', 'Many lines', <<<TEXT
        # Long
        {$lines}

        TEXT));

        $outline = $this->documents()->read(2, TextSelection::from([]));
        $part = $this->documents()->read(2, TextSelection::from(['section' => '1']));

        $this->assertSame(['1 Long (lines 1-302)'], $outline->outline);
        $this->assertSame('1-200', $part->lines);
        $this->assertSame(self::CONTINUATION, $part->continuation);
        $this->assertSame(200, count(explode("\n", (string) $part->text)));
    }

    public function test_a_continuation_after_a_new_revision_is_refused(): void
    {
        $draft = $this->bus()->run(new OpenDocumentCommand('1'));
        $draft = $this->bus()->run(new ReplaceDocumentTextCommand($draft->target(), 'None.', 'Late.'));
        $this->bus()->run(new CloseDocumentCommand($draft->target()));

        $this->expectException(StaleRead::class);

        $this->documents()->read(1, TextSelection::from(['firstLine' => 2]), expectedRevision: 1);
    }

    public function test_search_finds_a_body_phrase_with_its_revision_and_never_a_draft_or_a_wildcard(): void
    {
        $this->bus()->run(new CreateReportCommand('Check', 'What we found', "Rates of 50%_off\n"));
        $draft = $this->bus()->run(new OpenDocumentCommand('1'));
        $this->bus()->run(new ReplaceDocumentTextCommand($draft->target(), 'None.', 'Only in the draft.'));

        $found = $this->documents()->list(new DocumentFilters(query: 'ship THE editor'));

        $this->assertSame(['revision 1'], array_map(fn ($row) => $row->foundIn, $found->rows));
        $this->assertStringContainsString(self::SHIPPED_PHRASE, (string) $found->rows[0]->snippet);
        $this->assertSame([], $this->documents()->list(new DocumentFilters(query: 'Only in the draft'))->rows);
        $this->assertCount(1, $this->reports()->list(new DocumentFilters(query: '%_'))->rows);
        $this->assertSame([], $this->reports()->list(new DocumentFilters(query: '0_o'))->rows);
    }

    public function test_paging_after_a_cursor_shows_every_older_row_once_while_rows_are_added(): void
    {
        foreach (range(2, 5) as $number) {
            $this->bus()->run(new CreateDocumentCommand("Doc {$number}", 'More', "Text\n"));
        }

        $first = $this->documents()->list(new DocumentFilters(perPage: 2));
        $this->bus()->run(new CreateDocumentCommand('Newer', 'Added while paging', "Text\n"));
        $second = $this->documents()->list(new DocumentFilters(perPage: 2, after: (string) $first->next));
        $third = $this->documents()->list(new DocumentFilters(perPage: 2, after: (string) $second->next));

        $this->assertSame(
            [
                '5',
                '4',
                '3',
                '2',
                '1',
            ],
            array_map(fn ($row) => $row->number, [
                ...$first->rows,
                ...$second->rows,
                ...$third->rows,
            ]),
        );
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
        $this->bus()->run(
            $subject instanceof TextRange ? new PostTextCommentCommand(
                $this->document(),
                $body,
                $subject,
                (string) Str::uuid(),
            ) : new PostCommentCommand($this->document(), $body, (string) Str::uuid()),
        );
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
