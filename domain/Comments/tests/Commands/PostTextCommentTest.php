<?php

declare(strict_types=1);

namespace Domain\Comments\Tests\Commands;

use App\Exceptions\TargetHasNoText;
use App\Support\RecordIdentity;
use App\Values\TextRange;
use Domain\Comments\Commands\PostTextComment\PostTextCommentCommand;
use Domain\Comments\Models\Comment;
use Domain\Comments\Tests\TestCase;
use Illuminate\Support\Str;
use Tests\Fixtures\Modules\Notes\Models\Note;
use Tests\Fixtures\Modules\Notes\Models\NotePage;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsNotesModule;
use Tests\Support\Seeding\SeedsJournal;

/**
 * A reader comments on lines of a record's text: the comment is anchored to those lines of the version read, and a
 * record without text refuses a comment that points at text and keeps none.
 */
final class PostTextCommentTest extends TestCase
{
    use CommitsHookRows;
    use InstallsNotesModule;
    use SeedsJournal;

    private const array TABLES = [
        'comments',
        'users',
        'agents',
        'agent_sessions',
        'inboxes',
        'inbox_members',
        'number_groups',
        'command_receipts',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->createNotesTables();
        $this->installNotesModule();
        $this->journal()->agent('Writer', 'read-only-helper')->owner();
    }

    protected function tearDown(): void
    {
        $this->dropNotesTables();

        parent::tearDown();
    }

    public function test_a_comment_on_lines_is_anchored_to_those_lines_of_the_version_read(): void
    {
        $page = NotePage::written("# Plan\nFirst line.\nSecond line.\n");
        $target = new RecordIdentity(NotePage::linkType(), $page->id);

        $commentId = $this->journal()->run(
            new PostTextCommentCommand($target, 'Which lines?', TextRange::lines('1', 2, 3), (string) Str::uuid()),
        );

        $comment = Comment::query()->findOrFail($commentId);
        $this->assertSame('Which lines?', $comment->body);
        $this->assertSame([2, 3], [$comment->first_line, $comment->last_line]);
    }

    public function test_a_record_without_text_refuses_a_comment_on_text_and_keeps_none(): void
    {
        $note = new Note(['text' => 'Check the lock order']);
        $note->saveFor($this->journal()->agentCalled('Writer')->id);
        $target = new RecordIdentity(Note::linkType(), $note->id);

        $this->assertThrows(
            fn () => $this->journal()->run(
                new PostTextCommentCommand($target, 'Which line?', TextRange::lines('1', 1, 1), (string) Str::uuid()),
            ),
            TargetHasNoText::class,
        );
        $this->assertSame(0, Comment::query()->count());
    }
}
