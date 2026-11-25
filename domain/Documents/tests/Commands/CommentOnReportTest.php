<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Commands;

use Domain\Comments\Models\Comment;
use Domain\Documents\Commands\CommentOnReport\CommentOnReportCommand;
use Domain\Documents\Commands\CreateReport\CreateReportCommand;
use Domain\Documents\Exceptions\ReportMissing;
use Domain\Documents\Models\Report;
use Domain\Documents\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestProjects;

/**
 * A reader comments on a report named by its number or id, as themselves; a report that is not there is refused
 * and keeps no comment.
 */
#[TestsCommand(CommentOnReportCommand::class)]
final class CommentOnReportTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'reports',
        'comments',
        'number_groups',
        'command_receipts',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();
        $this->journal->run(new CreateReportCommand(
            'Design',
            'What we build',
            "# Goal\nShip it.\n",
            TestProjects::local()->id,
        ));
    }

    public function test_a_comment_by_number_lands_on_the_report_as_its_author(): void
    {
        $commentId = $this->journal->run(new CommentOnReportCommand('1', 'Looks good.'));

        $comment = Comment::query()->findOrFail($commentId);

        $this->assertSame(
            [
                Report::linkType(),
                Report::query()->sole()->id,
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

    public function test_a_report_that_is_not_there_is_refused_and_keeps_no_comment(): void
    {
        $this->assertThrows(
            fn () => $this->journal->run(new CommentOnReportCommand('99', 'Lost.')),
            ReportMissing::class,
        );

        $this->assertSame(0, Comment::query()->count());
    }
}
