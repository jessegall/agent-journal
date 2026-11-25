<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Commands;

use Domain\Comments\Models\Comment;
use Domain\Documents\Commands\CommentOnDocument\CommentOnDocumentCommand;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Exceptions\DocumentMissing;
use Domain\Documents\Models\Document;
use Domain\Documents\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\Seeding\SeedsJournal;

/**
 * A reader comments on a document named by its number or id, as themselves; a document that is not there is refused
 * and keeps no comment.
 */
final class CommentOnDocumentTest extends TestCase
{
    use CommitsHookRows;
    use SeedsJournal;

    private const array TABLES = ['documents', 'document_revisions', 'comments', 'number_groups', 'command_receipts'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal()->owner();
        $this->journal()->run(new CreateDocumentCommand('Design', 'What we build', "# Goal\nShip it.\n"));
    }

    public function test_a_comment_by_number_lands_on_the_document_as_its_author(): void
    {
        $commentId = $this->journal()->run(new CommentOnDocumentCommand('1', 'Looks good.'));

        $comment = Comment::query()->findOrFail($commentId);
        $this->assertSame(
            [Document::linkType(), Document::query()->sole()->id, 'Looks good.', $this->journal()->ownerUser()->id],
            [$comment->target_type, $comment->target_id, $comment->body, $comment->author_id],
        );
    }

    public function test_a_document_that_is_not_there_is_refused_and_keeps_no_comment(): void
    {
        $this->assertThrows(
            fn () => $this->journal()->run(new CommentOnDocumentCommand('99', 'Lost.')),
            DocumentMissing::class,
        );
        $this->assertSame(0, Comment::query()->count());
    }
}
