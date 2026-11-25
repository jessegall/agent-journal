<?php

declare(strict_types=1);

namespace Domain\Comments\Tests\Commands;

use App\Exceptions\RecordUnavailable;
use App\Exceptions\SubmissionKeyConflict;
use App\Support\ActorIdentity;
use App\Support\RecordIdentity;
use Domain\Comments\Commands\PostComment\PostCommentCommand;
use Domain\Comments\Models\Comment;
use Domain\Comments\Tests\TestCase;
use Illuminate\Support\Str;
use Tests\Fixtures\Modules\Notes\Models\Note;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsNotesModule;
use Tests\Support\Seeding\SeedsJournal;

/**
 * A reader comments on a whole record: the comment keeps its body and author on that record, the same submission
 * sent again is the same comment while another body under its key is a conflict, and a record that is not there takes
 * no comment.
 */
final class PostCommentTest extends TestCase
{
    use CommitsHookRows;
    use InstallsNotesModule;
    use SeedsJournal;

    private const string QUESTION = 'Is this still open?';

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

    private RecordIdentity $note;

    protected function setUp(): void
    {
        parent::setUp();

        $this->createNotesTables();
        $this->installNotesModule();
        $this->journal()->agent('Writer', 'read-only-helper')->owner();
        $note = new Note(['text' => 'Check the lock order']);
        $note->saveFor($this->journal()->agentCalled('Writer')->id);
        $this->note = new RecordIdentity(Note::linkType(), $note->id);
    }

    protected function tearDown(): void
    {
        $this->dropNotesTables();

        parent::tearDown();
    }

    public function test_a_comment_on_the_whole_record_keeps_its_body_and_author(): void
    {
        $commentId = $this->journal()->run(new PostCommentCommand($this->note, self::QUESTION, (string) Str::uuid()));

        $comment = Comment::query()->findOrFail($commentId);
        $this->assertSame(self::QUESTION, $comment->body);
        $this->assertSame(ActorIdentity::of($this->journal()->ownerUser())->id, $comment->author_id);
        $this->assertSame($this->note->id, $comment->target_id);
    }

    public function test_the_same_submission_is_one_comment_and_another_body_under_its_key_is_a_conflict(): void
    {
        $key = (string) Str::uuid();
        $first = $this->journal()->run(new PostCommentCommand($this->note, self::QUESTION, $key));
        $again = $this->journal()->run(new PostCommentCommand($this->note, self::QUESTION, $key));

        $this->assertSame($first, $again);
        $this->assertThrows(
            fn () => $this->journal()->run(new PostCommentCommand($this->note, 'Another question.', $key)),
            SubmissionKeyConflict::class,
        );
        $this->assertSame(1, Comment::query()->count());
    }

    public function test_a_record_that_is_not_there_takes_no_comment(): void
    {
        $missing = new RecordIdentity(Note::linkType(), (string) Str::ulid());

        $this->assertThrows(
            fn () => $this->journal()->run(new PostCommentCommand($missing, self::QUESTION, (string) Str::uuid())),
            RecordUnavailable::class,
        );
        $this->assertSame(0, Comment::query()->count());
    }
}
