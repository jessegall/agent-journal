<?php

declare(strict_types=1);

namespace Tests\Feature\Comments;

use App\Assignments\Support\Page;
use App\Bus\Contracts\CommandBus;
use App\Comments\Commands\PostComment;
use App\Comments\Commands\PostTextComment;
use App\Comments\Contracts\CommentResolver;
use App\Comments\Data\RecordCommentView;
use App\Comments\Data\TextCommentView;
use App\Comments\Exceptions\TargetNotCommentable;
use App\Comments\Models\Comment;
use App\Reads\Values\PageSize;
use App\Records\Support\RecordIdentity;
use App\Text\Contracts\TextResolver;
use App\Text\Support\TextSelection;
use App\Text\Values\TextRange;
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
        $page = $this->target(NotePage::query()->create(['text' => "# Plan\nFirst line.\nSecond line.\n"]));

        $this->assertSame(['1', 4], [$this->text()->version($page)->id, $this->text()->version($page)->lineCount]);
        $this->assertSame(['Plan'], array_map(fn ($section) => $section->heading, $this->text()->sections($page, '1', 0, PageSize::from(null))->items));
        $this->assertStringContainsString('Second line.', $this->text()->read($page, '1', new TextSelection(firstLine: 1))->text);

        $this->bus()->run(new PostTextComment($page, 'Which lines?', TextRange::lines('1', 2, 3), (string) Str::uuid()));
        $this->bus()->run(new PostComment($page, 'About the page.', (string) Str::uuid()));
        $items = $this->app->make(CommentResolver::class)->list($page, new Page())->items;

        $this->assertInstanceOf(TextCommentView::class, $items[0]);
        $this->assertInstanceOf(RecordCommentView::class, $items[1]);
    }

    public function test_a_note_snapshot_is_read_but_takes_no_comment(): void
    {
        $snapshot = $this->target(NoteSnapshot::query()->create(['text' => "# Snapshot\nKept.\n"]));

        $this->assertSame('1', $this->text()->version($snapshot)->id);
        $this->expectException(TargetNotCommentable::class);

        try {
            $this->bus()->run(new PostComment($snapshot, 'Hello.', (string) Str::uuid()));
        } finally {
            $this->assertSame(0, Comment::query()->count());
        }
    }

    private function target(NotePage|NoteSnapshot $record): RecordIdentity
    {
        return new RecordIdentity($record::LINK_TYPE, $record->id);
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
