<?php

declare(strict_types=1);

namespace Domain\Comments\Tests\Feature;

use Domain\Comments\Commands\PostComment\PostCommentCommand;
use Domain\Comments\Commands\PostTextComment\PostTextCommentCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Reads\TextResolver;
use Domain\Comments\Contracts\CommentResolver;
use App\Contracts\Records\RecordResolver;
use Domain\Comments\Data\RecordCommentLocation;
use Domain\Comments\Data\RecordCommentView;
use App\Exceptions\TargetHasNoText;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use Domain\Comments\Models\Comment;
use App\Support\Access\AccessSettings;
use App\Support\IdListPage;
use App\Support\RecordIdentity;
use App\Values\TextRange;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\Fixtures\Modules\Notes\Models\Note;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsNotesModule;
use Tests\Support\StartsAgentRequests;
use Domain\Comments\Tests\TestCase;

/**
 * A record with no text at all, a note of the Notes fixture, takes comments about the whole record through Core alone,
 * and refuses a comment that points at text.
 */
final class WholeRecordCommentTest extends TestCase
{
    use CommitsHookRows;
    use InstallsNotesModule;
    use StartsAgentRequests;

    private const string NO_TEXT_REFUSAL = 'A notes.note has no text to read or point at; '
        .'a comment on it is about the whole record.';

    private const string FIRST_ABSTRACT = 'Comment 1.';

    private const string QUESTION = 'Is this still open?';

    private const string WIRE_TEXT = 'Over the wire.';

    private const string NOTE_LABEL = 'note %d';

    private const array TABLES = ['comments', 'users', 'agents', 'number_groups'];

    private User $owner;

    private Note $note;

    protected function setUp(): void
    {
        parent::setUp();

        $this->createNotesTables();

        $this->installNotesModule();
        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $writer = Agent::create('Writer', 'read-only-helper');
        $this->note = new Note(['text' => 'Check the lock order']);
        $this->note->saveFor($writer->id);
        $this->startUserRequestAs($this->owner->id);
    }

    protected function tearDown(): void
    {
        $this->dropNotesTables();

        parent::tearDown();
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
        $this->assertSame(sprintf(self::NOTE_LABEL, $this->note->number), $location->target->label);
    }

    public function test_a_comment_on_text_is_refused_for_a_record_without_text(): void
    {
        $this->expectException(TargetHasNoText::class);

        try {
            $this->app->make(CommandBus::class)->run(
                new PostTextCommentCommand($this->target(), 'Which line?', TextRange::lines('1', 1, 1), (string) Str::uuid()),
            );
        } finally {
            $this->assertSame(0, Comment::query()->count());
        }
    }

    public function test_a_signed_in_user_comments_and_reads_the_comments_over_http(): void
    {
        $this->actingAs($this->owner)
            ->post(
                '/comments/post',
                [
                    'target' => sprintf(self::NOTE_LABEL, $this->note->number),
                    'body' => self::WIRE_TEXT,
                    'submission_key' => (string) Str::uuid(),
                ],
            )
            ->assertRedirect();

        $this->actingAs($this->owner)
            ->getJson('/comments/list?target='.urlencode(sprintf(self::NOTE_LABEL, $this->note->number)))
            ->assertOk()
            ->assertJsonPath('items.0.type', 'record')
            ->assertJsonPath('items.0.comment.body', self::WIRE_TEXT);
    }

    public function test_a_mixed_or_partial_place_is_refused_with_nothing_stored(): void
    {
        $note = sprintf(self::NOTE_LABEL, $this->note->number);

        $this->actingAs($this->owner)
            ->postJson(
                '/comments/post',
                [
                    'target' => $note,
                    'body' => 'Mixed.',
                    'submission_key' => (string) Str::uuid(),
                    'version' => '1',
                    'section' => 3,
                    'quote' => 'x',
                    'first_line' => 1,
                    'last_line' => 1,
                    'start_offset' => 0,
                    'end_offset' => 1,
                ],
            )
            ->assertUnprocessable();
        $this->actingAs($this->owner)
            ->postJson(
                '/comments/post',
                [
                    'target' => $note,
                    'body' => 'No version.',
                    'submission_key' => (string) Str::uuid(),
                    'first_line' => 12,
                    'last_line' => 16,
                ],
            )
            ->assertUnprocessable();

        $this->assertSame(0, Comment::query()->count());
    }

    public function test_an_author_field_is_refused(): void
    {
        $this->actingAs($this->owner)
            ->postJson(
                '/comments/post',
                [
                    'target' => sprintf(self::NOTE_LABEL, $this->note->number),
                    'body' => 'Spoofed.',
                    'submission_key' => (string) Str::uuid(),
                    'author_id' => 'someone',
                ],
            )
            ->assertUnprocessable();

        $this->assertSame(0, Comment::query()->count());
    }

    public function test_a_record_without_text_has_no_text_to_read(): void
    {
        $this->expectException(TargetHasNoText::class);

        $this->app->make(TextResolver::class)->version($this->target());
    }

    public function test_the_text_routes_refuse_a_record_without_text(): void
    {
        $this->actingAs($this->owner)
            ->getJson('/text/version?target='.urlencode(sprintf(self::NOTE_LABEL, $this->note->number)))
            ->assertForbidden()
            ->assertJsonPath(
                'message',
                self::NO_TEXT_REFUSAL,
            );
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
            array_fill(0, 3, "comment on note {$this->note->number}"),
            array_map(fn ($card) => $card->label, $cards),
        );
        $this->assertSame(self::FIRST_ABSTRACT, $cards[0]->abstract);
        $this->assertLessThanOrEqual(4, $queries);
    }

    private function target(): RecordIdentity
    {
        return new RecordIdentity(Note::linkType(), $this->note->id);
    }
}
