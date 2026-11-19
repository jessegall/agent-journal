<?php

declare(strict_types=1);

namespace Domain\Documents\Console\Concerns;

use App\Text\Enums\TextAnchorType;
use App\AgentRequests\Contracts\AgentRequestSender;
use App\Comments\Data\CommentDetails;
use App\Text\Values\TextAnchor;

/**
 * How doc:comments and report:comments print a page of a record's comments: author and time, the place a text comment
 * points at with its version and lines, its text, and the id to read on after when there are more.
 */
trait PrintsComments
{
    use SendsRecordCalls;

    protected function showComments(AgentRequestSender $journal, string $type): int
    {
        $fields = ['target' => $type.' '.$this->argument('number')];

        if (is_string($this->option('after'))) {
            $fields['after'] = $this->option('after');
        }

        $reply = $this->sendSigned($journal, '/agent/comments/list', $fields);

        if ($reply === null) {
            return self::FAILURE;
        }

        /**
         * @var array{
         *     items: list<array{
         *         comment: array<string, mixed>,
         *         anchor?: array{
         *             versionId: string,
         *             versionLabel: string,
         *             type: string,
         *             sectionNumber: int,
         *             firstLine: int,
         *             lastLine: int,
         *             quote: string,
         *             startOffset: int,
         *             endOffset: int,
         *         },
         *     }>,
         *     nextAfter: string|null,
         * } $reply
         */
        $this->printComments($reply['items']);

        if ($reply['nextAfter'] !== null) {
            $this->line("More: --after={$reply['nextAfter']}");
        }

        return self::SUCCESS;
    }

    /**
     * @param  list<array{
     *     comment: array<string, mixed>,
     *     anchor?: array{
     *         versionId: string,
     *         versionLabel: string,
     *         type: string,
     *         sectionNumber: int,
     *         firstLine: int,
     *         lastLine: int,
     *         quote: string,
     *         startOffset: int,
     *         endOffset: int,
     *     },
     * }>  $items
     */
    private function printComments(array $items): void
    {
        if ($items === []) {
            $this->line('No comments.');
        }

        foreach (CommentDetails::collect(array_column($items, 'comment')) as $index => $comment) {
            $anchor = $items[$index]['anchor'] ?? null;
            $this->printComment($comment, $anchor === null ? 'on the whole record' : $this->placeOf($anchor));
        }
    }

    /**
     * Where an anchor the journal answered with points, as a person reads it.
     *
     * @param  array{
     *     versionId: string,
     *     versionLabel: string,
     *     type: string,
     *     sectionNumber: int,
     *     firstLine: int,
     *     lastLine: int,
     *     quote: string,
     *     startOffset: int,
     *     endOffset: int,
     * }  $anchor
     */
    private function placeOf(array $anchor): string
    {
        return TextAnchor::restored(
            $anchor['versionId'],
            $anchor['versionLabel'],
            TextAnchorType::from($anchor['type']),
            $anchor['sectionNumber'],
            $anchor['firstLine'],
            $anchor['lastLine'],
            $anchor['quote'],
            $anchor['startOffset'],
            $anchor['endOffset'],
        )->description();
    }

    private function printComment(CommentDetails $comment, string $place): void
    {
        $this->line("{$comment->authorType->value} {$comment->authorId}  {$comment->createdAt}");
        $this->line("  {$place}");
        $this->line('  '.str_replace("\n", "\n  ", $comment->body));
    }
}
