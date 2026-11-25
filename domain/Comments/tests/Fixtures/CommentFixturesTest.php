<?php

declare(strict_types=1);

namespace Domain\Comments\Tests\Fixtures;

use App\Enums\Records\TextAnchorType;
use App\Support\RecordIdentity;
use App\Values\TextRange;
use Domain\Comments\Tests\TestCase;
use Tests\Fixtures\Modules\Notes\Models\NotePage;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsNotesModule;

/**
 * A comment on lines posted through the journal keeps the version and lines it was posted on, even after the text it
 * points at changes, and counts only for its own target.
 */
final class CommentFixturesTest extends TestCase
{
    use CommitsHookRows;
    use InstallsNotesModule;

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
        $this->journal->agent('Writer', 'read-only-helper')->owner();
    }

    protected function tearDown(): void
    {
        $this->dropNotesTables();

        parent::tearDown();
    }

    public function test_a_line_comment_keeps_its_version_and_lines_after_the_text_changes(): void
    {
        $page = NotePage::written("# Plan\nFirst line.\nSecond line.\n");
        $other = new RecordIdentity(NotePage::linkType(), NotePage::written("# Other\n")->id);
        $target = new RecordIdentity(NotePage::linkType(), $page->id);

        $comments = $this->journal->fixtures(CommentFixtures::class)
            ->textComment('Which', $target, 'Owner', 'Which lines?', TextRange::lines('1', 2, 3))
            ->recordComment('Whole', $target, 'Writer', 'All of it.');

        $page->forceFill(['text' => "# Plan\nA new first line.\n"])->save();

        $comments->assertAnchor('Which', $target, TextAnchorType::Lines, version: '1', lines: [2, 3])
            ->assertComment('Whole', author: 'Writer', body: 'All of it.')
            ->assertCount($target, 2)
            ->assertCount($other, 0);
    }
}
