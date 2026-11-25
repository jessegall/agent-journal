<?php

declare(strict_types=1);

namespace Tests\Feature\Comments;

use App\Commands\Comments\PostComment\PostCommentCommand;
use App\Commands\Comments\PostTextComment\PostTextCommentCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Reads\TextResolver;
use App\Contracts\Records\CommentResolver;
use App\Data\Comments\RecordCommentView;
use App\Data\Comments\TextCommentView;
use App\Exceptions\TargetNotCommentable;
use App\Models\Records\Comment;
use App\Support\IdListPage;
use App\Support\RecordIdentity;
use App\Support\TextSelection;
use App\Values\PageSize;
use App\Values\TextRange;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Str;
use Tests\Fixtures\Modules\Notes\Models\NotePage;
use Tests\Fixtures\Modules\Notes\Models\NoteSnapshot;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsNotesModule;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * A record outside Documents with text in versions, a note page, is read through Core and takes its first text
 * comment and whole-record comments alike; a note snapshot has text to read but takes no comments.
 */
final class TextOwnerCommentTest extends TestCase
{
    use CommitsHookRows;
    use InstallsNotesModule;
    use StartsAgentRequests;

    private const string SECOND_LINE = 'Second line.';

    private const array TABLES = ['comments', 'users', 'number_groups'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->createNotesTables();
        $this->installNotesModule();
        $owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($owner->id));
        $this->startUserRequestAs($owner->id);
    }

    protected function tearDown(): void
    {
        $this->dropNotesTables();

        parent::tearDown();
    }

    public function test_a_note_page_is_read_and_takes_its_first_text_comment_beside_a_whole_record_one(): void
    {
        $page = $this->target(NotePage::written(<<<'TEXT'
        # Plan
        First line.
        Second line.

        TEXT));

        $this->assertSame(['1', 4], [$this->text()->version($page)->id, $this->text()->version($page)->lineCount]);
        $this->assertSame(
            ['Plan'],
            array_map(
                fn ($section) => $section->heading,
                $this->text()->sections($page, '1', 0, PageSize::from(null))->sections,
            ),
        );
        $this->assertStringContainsString(
            self::SECOND_LINE,
            $this->text()->read($page, '1', TextSelection::from(['firstLine' => 1]))->text,
        );

        $this->bus()->run(
            new PostTextCommentCommand($page, 'Which lines?', TextRange::lines('1', 2, 3), (string) Str::uuid()),
        );
        $this->bus()->run(new PostCommentCommand($page, 'About the page.', (string) Str::uuid()));
        $items = $this->app->make(CommentResolver::class)->list($page, new IdListPage())->comments;

        $this->assertInstanceOf(TextCommentView::class, $items[0]);
        $this->assertInstanceOf(RecordCommentView::class, $items[1]);
    }

    public function test_a_note_snapshot_is_read_but_takes_no_comment(): void
    {
        $snapshot = $this->target(NoteSnapshot::written(<<<'TEXT'
        # Snapshot
        Kept.

        TEXT));

        $this->assertSame('1', $this->text()->version($snapshot)->id);
        $this->expectException(TargetNotCommentable::class);

        try {
            $this->bus()->run(new PostCommentCommand($snapshot, 'Hello.', (string) Str::uuid()));
        } finally {
            $this->assertSame(0, Comment::query()->count());
        }
    }

    private function target(NotePage|NoteSnapshot $record): RecordIdentity
    {
        return new RecordIdentity($record::linkType(), $record->id);
    }

    private function text(): TextResolver
    {
        return $this->app->make(TextResolver::class);
    }

    private function bus(): CommandBus
    {
        return $this->app->make(CommandBus::class);
    }
}
