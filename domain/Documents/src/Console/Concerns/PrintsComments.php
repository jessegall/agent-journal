<?php

declare(strict_types=1);

namespace Domain\Documents\Console\Concerns;

use App\AgentRequests\Values\CommandReport;
use App\Comments\Calls\ListCommentsCall;
use App\Comments\Data\CommentDetails;
use App\Comments\Data\RecordCommentView;
use App\Comments\Data\TextCommentView;

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
            $list = $this->sendCall($call);
            $report = $this->commentsReport(CommandReport::ending(self::SUCCESS), $list->items);

            return $list->nextAfter === null ? $report : $report->line("More: --after={$list->nextAfter}");
        });
    }

    /**
     * @param  list<RecordCommentView|TextCommentView>  $items
     */
    private function commentsReport(CommandReport $start, array $items): CommandReport
    {
        if ($items === []) {
            return $start->line('No comments.');
        }

        $report = $start;

        foreach ($items as $item) {
            $place = $item instanceof TextCommentView ? $item->anchor->description() : 'on the whole record';
            $report = $this->commentReport($report, $item->comment, $place);
        }

        return $report;
    }

    private function commentReport(CommandReport $report, CommentDetails $comment, string $place): CommandReport
    {
        return $report
            ->line("{$comment->authorType->value} {$comment->authorId}  {$comment->createdAt}")
            ->line("  {$place}")
            ->line('  '.str_replace("\n", "\n  ", $comment->body));
    }
}
