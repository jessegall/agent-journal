<?php

declare(strict_types=1);

namespace Tests\Feature\Comments;

use App\Agents\Models\Agent;
use App\Assignments\Support\Page;
use App\Assignments\Support\RecordIdentity;
use App\Bus\Contracts\CommandBus;
use App\Comments\Commands\PostComment;
use App\Comments\Commands\PostTextComment;
use App\Comments\Contracts\CommentReader;
use App\Comments\Data\RecordCommentLocation;
use App\Comments\Data\RecordCommentView;
use App\Comments\Exceptions\TargetHasNoText;
use App\Comments\Models\Comment;
use App\Text\Values\TextRange;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Tests\Fixtures\Modules\Notes\Models\Note;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsNotesModule;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * A record with no text at all, a note of the Notes fixture, takes comments about the whole record through Core alone,
 * and refuses a comment that points at text.
 */
final class WholeRecordCommentTest extends TestCase
{
    use CommitsHookRows;
    use InstallsNotesModule;
    use StartsAgentRequests;

    private const array TABLES = ['comments', 'users', 'agents', 'number_groups'];

    private User $owner;

    private Note $note;

    protected function setUp(): void
    {
        parent::setUp();

        foreach (glob(base_path('tests/Fixtures/Modules/Notes/database/migrations/*.php')) ?: [] as $migration) {
            (require $migration)->up();
        }

        $this->installNotesModule();
        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $writer = Agent::query()->create(['name' => 'Writer', 'role' => 'hooks.read_only_helper_ready']);
        $this->note = new Note(['text' => 'Check the lock order']);
        $this->note->saveFor($writer->id);
        $this->startUserRequestAs($this->owner->id);
    }

    protected function tearDown(): void
    {
        Schema::dropIfExists('module_notes');

        parent::tearDown();
    }

    public function test_a_comment_on_the_whole_note_is_listed_and_leads_to_the_note(): void
    {
        $commentId = $this->app->make(CommandBus::class)->run(new PostComment($this->target(), 'Is this still open?', (string) Str::uuid()));

        $items = $this->app->make(CommentReader::class)->list($this->target(), new Page)->items;
        $location = $this->app->make(CommentReader::class)->location($this->target(), $commentId);

        $this->assertInstanceOf(RecordCommentView::class, $items[0]);
        $this->assertSame('Is this still open?', $items[0]->comment->body);
        $this->assertInstanceOf(RecordCommentLocation::class, $location);
        $this->assertSame("note {$this->note->number}", $location->target->label);
    }

    public function test_a_comment_on_text_is_refused_for_a_record_without_text(): void
    {
        $this->expectException(TargetHasNoText::class);

        try {
            $this->app->make(CommandBus::class)->run(new PostTextComment($this->target(), 'Which line?', TextRange::lines('1', 1, 1), (string) Str::uuid()));
        } finally {
            $this->assertSame(0, Comment::query()->count());
        }
    }

    public function test_a_signed_in_user_comments_and_reads_the_comments_over_http(): void
    {
        $this->actingAs($this->owner)
            ->post('/comments/post', ['target' => "note {$this->note->number}", 'body' => 'Over the wire.', 'submission_key' => (string) Str::uuid()])
            ->assertRedirect();

        $this->actingAs($this->owner)
            ->getJson('/comments/list?target='.urlencode("note {$this->note->number}"))
            ->assertOk()
            ->assertJsonPath('items.0.type', 'record')
            ->assertJsonPath('items.0.comment.body', 'Over the wire.');
    }

    public function test_an_author_field_is_refused(): void
    {
        $this->actingAs($this->owner)
            ->postJson('/comments/post', ['target' => "note {$this->note->number}", 'body' => 'Spoofed.', 'submission_key' => (string) Str::uuid(), 'author_id' => 'someone'])
            ->assertUnprocessable();

        $this->assertSame(0, Comment::query()->count());
    }

    private function target(): RecordIdentity
    {
        return new RecordIdentity(Note::LINK_TYPE, $this->note->id);
    }
}
