<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Commands;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Records\RecordResolver;
use App\Exceptions\AnchorMismatch;
use App\Models\Agents\Agent;
use App\Support\ActorReference;
use App\Support\IdListPage;
use App\Support\RecordIdentity;
use App\Support\RecordReference;
use App\Values\OwnerAuthority;
use App\Values\TextRange;
use Domain\Comments\Commands\PostComment\PostCommentCommand;
use Domain\Comments\Commands\PostTextComment\PostTextCommentCommand;
use Domain\Comments\Contracts\CommentResolver;
use Domain\Comments\Data\RecordCommentView;
use Domain\Comments\Data\TextCommentLocation;
use Domain\Comments\Data\TextCommentView;
use Domain\Comments\Enums\WholeRecord;
use Domain\Comments\Models\Comment;
use Domain\Documents\Commands\CloseDocument\CloseDocumentCommand;
use Domain\Documents\Commands\CommentOnDocument\CommentOnDocumentCommand;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\OpenDocument\OpenDocumentCommand;
use Domain\Documents\Commands\ReplaceDocumentText\ReplaceDocumentTextCommand;
use Domain\Documents\Contracts\Documents\DocumentResolver;
use Domain\Documents\Exceptions\DocumentMissing;
use Domain\Documents\Models\Document;
use Domain\Documents\Tests\TestCase;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestIds;

/**
 * A reader comments on a document named by its number or id, as themselves; a document that is not there is refused
 * and keeps no comment.
 */
#[TestsCommand(CommentOnDocumentCommand::class)]
final class CommentOnDocumentTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'documents',
        'document_revisions',
        'comments',
        'number_groups',
        'command_receipts',
        'agents',
        'document_closes',
        'document_drafts',
        'reports',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'links',
        'text_uploads',
        'text_upload_chunks',
    ];

    private const string THIRD_PART = 'Third part.';

    private const string SECTION_COMMENT = 'Check the first section.';

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();

        $this->journal->run(new CreateDocumentCommand('Design', 'What we build', <<<'TEXT'
        # Goal
        Ship the editor.

        ## Risks
        None.

        TEXT));
    }

    public function test_a_comment_by_number_lands_on_the_document_as_its_author(): void
    {
        $commentId = $this->journal->run(new CommentOnDocumentCommand('1', 'Looks good.'));

        $comment = Comment::query()->findOrFail($commentId);

        $this->assertSame(
            [
                Document::linkType(),
                Document::query()->sole()->id,
                'Looks good.',
                $this->journal->ownerUser()->id,
            ],
            [
                $comment->target_type,
                $comment->target_id,
                $comment->body,
                $comment->author_id,
            ],
        );
    }

    public function test_a_document_that_is_not_there_is_refused_and_keeps_no_comment(): void
    {
        $this->assertThrows(
            fn () => $this->journal->run(new CommentOnDocumentCommand('99', 'Lost.')),
            DocumentMissing::class,
        );

        $this->assertSame(0, Comment::query()->count());
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
        $agent = $this->journal->idleAgent('Commenter', 'read-only-helper')->agentCalled('Commenter');
        $this->journal->actAsAgentIds($agent->id, TestIds::of(9));

        $this->comment('From an agent.', WholeRecord::Record);

        $this->app->make(CurrentActorSetter::class)->set(
            ActorReference::forUser(TestIds::of(1)),
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

    public function test_the_signed_comment_route_posts_on_the_document(): void
    {
        $author = $this->journal->signedStart('Main agent', 'main-agent');
        $author->startRequest($this->app);

        $document = $this->app->make(CommandBus::class)->run(
            new CreateDocumentCommand('Design', 'Current design.', 'Published text.'),
        );

        $this->journal->agentCall($author, 'POST', '/agent/docs/comment', [
            'doc_id' => $document->id,
            'body' => self::SECTION_COMMENT,
            'request_key' => 'comment-on-design',
        ])->assertOk();

        $this->assertSame(self::SECTION_COMMENT, Comment::query()->sole()->body);
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }

    private function documents(): DocumentResolver
    {
        return $this->app->make(DocumentResolver::class);
    }

    private function document(): RecordIdentity
    {
        return $this->documentNumbered(1);
    }

    private function comments(): CommentResolver
    {
        return $this->app->make(CommentResolver::class);
    }

    private function documentNumbered(int $number): RecordIdentity
    {
        return $this->app->make(RecordResolver::class)->identify(RecordReference::of('doc', $number));
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
}
