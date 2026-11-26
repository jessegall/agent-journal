<?php

declare(strict_types=1);

namespace Domain\Comments\Tests\Commands;

use App\Bus\Contracts\CommandBus;
use App\Exceptions\RecordUnavailable;
use App\Exceptions\SubmissionKeyConflict;
use App\Records\Contracts\RecordResolver;
use App\Support\ActorReference;
use App\Support\IdListPage;
use App\Support\RecordIdentity;
use Domain\Comments\Commands\PostComment\PostCommentCommand;
use Domain\Comments\CommentsDomain;
use Domain\Comments\Contracts\CommentResolver;
use Domain\Comments\Data\RecordCommentLocation;
use Domain\Comments\Data\RecordCommentView;
use Domain\Comments\Models\Comment;
use Domain\Comments\Tests\TestCase;
use Domain\Rules\RulesDomain;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\Fixtures\Modules\Cards\CardsDomain;
use Tests\Fixtures\Modules\Notes\Models\Note;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\InstallsNotesModule;

/**
 * A reader comments on a whole record: the comment keeps its body and author on that record, the same submission
 * sent again is the same comment while another body under its key is a conflict, and a record that is not there takes
 * no comment.
 */
#[TestsCommand(PostCommentCommand::class)]
final class PostCommentTest extends TestCase
{
    use CommitsHookRows;
    use InstallsNotesModule;

    /**
     * The notes module these tests install requires Cards and Rules beside Comments.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(CommentsDomain::class, CardsDomain::class, RulesDomain::class);
    }

    private const string QUESTION = 'Is this still open?';

    private const array TABLES = [
        'comment_anchors',
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

    private const string FIRST_ABSTRACT = 'Comment 1.';

    private const string NOTE_LABEL = 'note %d';

    private const string WIRE_TEXT = 'Over the wire.';

    protected function setUp(): void
    {
        parent::setUp();

        $this->createNotesTables();
        $this->installNotesModule();
        $this->journal->agent('Writer', 'read-only-helper')->owner();
        $note = new Note(['text' => 'Check the lock order']);
        $note->saveFor($this->journal->agentCalled('Writer')->id);
        $this->note = new RecordIdentity(Note::linkType(), $note->id);
    }

    protected function tearDown(): void
    {
        $this->dropNotesTables();

        parent::tearDown();
    }

    public function test_a_comment_on_the_whole_record_keeps_its_body_and_author(): void
    {
        $commentId = $this->journal->run(new PostCommentCommand($this->note, self::QUESTION, (string) Str::uuid()));

        $comment = Comment::query()->findOrFail($commentId);
        $this->assertSame(self::QUESTION, $comment->body);
        $this->assertSame(ActorReference::of($this->journal->ownerUser())->id, $comment->author_id);
        $this->assertSame($this->note->id, $comment->target_id);
    }

    public function test_the_same_submission_is_one_comment_and_another_body_under_its_key_is_a_conflict(): void
    {
        $key = (string) Str::uuid();
        $first = $this->journal->run(new PostCommentCommand($this->note, self::QUESTION, $key));
        $again = $this->journal->run(new PostCommentCommand($this->note, self::QUESTION, $key));

        $this->assertSame($first, $again);

        $this->assertThrows(
            fn () => $this->journal->run(new PostCommentCommand($this->note, 'Another question.', $key)),
            SubmissionKeyConflict::class,
        );

        $this->assertSame(1, Comment::query()->count());
    }

    public function test_a_record_that_is_not_there_takes_no_comment(): void
    {
        $missing = new RecordIdentity(Note::linkType(), (string) Str::ulid());

        $this->assertThrows(
            fn () => $this->journal->run(new PostCommentCommand($missing, self::QUESTION, (string) Str::uuid())),
            RecordUnavailable::class,
        );

        $this->assertSame(0, Comment::query()->count());
    }

    public function test_a_comment_on_the_whole_note_is_listed_and_leads_to_the_note(): void
    {
        $commentId = $this->app->make(CommandBus::class)->run(
            new PostCommentCommand($this->target(), self::QUESTION, (string) Str::uuid()),
        );

        $items = $this->app->make(CommentResolver::class)->list($this->target(), new IdListPage())->comments;
        $location = $this->app->make(CommentResolver::class)->location($this->target(), $commentId);

        $this->assertInstanceOf(RecordCommentView::class, $items[0]);
        $this->assertSame(self::QUESTION, $items[0]->comment->body);
        $this->assertInstanceOf(RecordCommentLocation::class, $location);
        $this->assertSame(sprintf(self::NOTE_LABEL, $this->noteNumber()), $location->target->label);
    }

    public function test_comment_cards_come_in_one_batch_and_hide_comments_on_unreadable_records(): void
    {
        $ids = array_map(
            fn (int $index) => $this->app->make(CommandBus::class)->run(
                new PostCommentCommand($this->target(), "Comment {$index}.", (string) Str::uuid()),
            ),
            range(1, 3),
        );

        $wanted = [
            ...array_map(fn (string $id) => new RecordIdentity(Comment::linkType(), $id), $ids),
            new RecordIdentity(Comment::linkType(), strtolower((string) Str::ulid())),
        ];

        DB::enableQueryLog();
        $cards = $this->app->make(RecordResolver::class)->visibleCards($wanted);
        $queries = count(DB::getQueryLog());

        $this->assertSame(
            array_fill(0, 3, "comment on note {$this->noteNumber()}"),
            array_map(fn ($card) => $card->label, $cards),
        );

        $this->assertSame(self::FIRST_ABSTRACT, $cards[0]->abstract);
        $this->assertLessThanOrEqual(4, $queries);
    }

    private function target(): RecordIdentity
    {
        return new RecordIdentity(Note::linkType(), $this->note->id);
    }

    private function noteNumber(): int
    {
        return Note::query()->withoutGlobalScopes()->findOrFail($this->note->id)->number;
    }
}
