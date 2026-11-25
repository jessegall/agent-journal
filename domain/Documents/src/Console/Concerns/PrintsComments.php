<?php

declare(strict_types=1);

namespace Domain\Documents\Console\Concerns;

use App\Calls\Comments\ListCommentsCall;
use App\Data\Comments\CommentDetails;
use App\Data\Comments\RecordCommentView;
use App\Data\Comments\TextCommentView;
use App\Values\CommandReport;

/**
 * How doc:comments and report:comments print a page of a record's comments: author and time, the place a text comment
 * points at with its version and lines, its text, and the id to read on after when there are more.
 */
trait PrintsComments
{
    protected function showComments(string $type): int
    {
        $after = $this->option('after');

        $call = ListCommentsCall::from([
            'target' => "{$type} {$this->argument('number')}",
            'after' => is_string($after) ? $after : null,
        ]);

        return $this->runReport(function () use ($call): CommandReport {
            $commentPage = $this->sendCall($call);
            $report = $this->commentsReport(CommandReport::ending(self::SUCCESS), $commentPage->comments);

            if ($commentPage->nextAfter === null) {
                return $report;
            }

            return $report->line("More: --after={$commentPage->nextAfter}");
        });
    }

    /**
     * @param  list<RecordCommentView|TextCommentView>  $comments
     */
    private function commentsReport(CommandReport $start, array $comments): CommandReport
    {
        if ($comments === []) {
            return $start->line('No comments.');
        }

        $report = $start;

        foreach ($comments as $commentView) {
            $anchorDescription = $commentView instanceof TextCommentView
                ? $commentView->anchor->description()
                : 'on the whole record';

            $report = $this->commentReport($report, $commentView->comment, $anchorDescription);
        }

        return $report;
    }

    private function commentReport(
        CommandReport $report,
        CommentDetails $comment,
        string $anchorDescription,
    ): CommandReport {
        return $report
            ->line("{$comment->authorType} {$comment->authorId}  {$comment->createdAt}")
            ->line("  {$anchorDescription}")
            ->line('  '.str_replace("\n", "\n  ", $comment->body));
    }
}
