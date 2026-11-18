<?php

declare(strict_types=1);

namespace Domain\Documents\Console\Concerns;

use App\AgentRequests\Contracts\AgentRequestSender;
use Domain\Documents\Data\CommentCard;

/**
 * How doc:comments and report:comments print a page of comments: author and time, the quote an anchored one points
 * at, and its text.
 */
trait PrintsComments
{
    use SendsRecordCalls;

    protected function showComments(AgentRequestSender $journal, string $path): int
    {
        $reply = $this->sendSigned($journal, $path, ['number' => (string) $this->argument('number'), 'page' => (int) $this->option('page')]);

        if ($reply === null) {
            return self::FAILURE;
        }

        $this->printComments(array_values(CommentCard::collect($reply['comments'], 'array')));

        return self::SUCCESS;
    }

    /**
     * @param  list<CommentCard>  $comments
     */
    private function printComments(array $comments): void
    {
        if ($comments === []) {
            $this->line('No comments.');
        }

        foreach ($comments as $comment) {
            $this->line("user {$comment->authorId}  {$comment->createdAt}");

            if ($comment->revision !== null) {
                $this->line("  on revision {$comment->revision}: \"{$comment->quote}\"");
            }

            $this->line('  '.str_replace("\n", "\n  ", $comment->body));
        }
    }
}
