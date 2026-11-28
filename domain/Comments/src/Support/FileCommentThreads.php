<?php

declare(strict_types=1);

namespace Domain\Comments\Support;

use App\Actors\Contracts\ActorLabels;
use App\Connections\Data\FileCommentData;
use App\Connections\Data\FileThreadData;
use App\Models\Projects\ProjectFile;
use App\Projects\Contracts\FileComments;
use App\Support\ActorNames;
use App\Support\ActorReference;
use App\Support\IdListPage;
use App\Support\RecordIdentity;
use Domain\Comments\Contracts\CommentResolver;
use Domain\Comments\Data\TextCommentView;

/**
 * The comments on lines of a project file, shown in the File window as one thread per range of lines.
 */
final readonly class FileCommentThreads implements FileComments
{
    public function __construct(
        private CommentResolver $comments,
        private ActorLabels $labels,
    ) {}

    public function threadsOn(ProjectFile $file, string $digest, array $lines): array
    {
        $target = new RecordIdentity(ProjectFile::linkType(), $file->id);
        $listed = $this->comments->list($target, new IdListPage(limit: IdListPage::LARGEST_LIMIT));

        $onVersion = array_values(array_filter(
            $listed->comments,
            fn ($comment) => $comment instanceof TextCommentView && $comment->anchor->versionId === $digest,
        ));

        $labels = $this->labels->labelsFor(array_map(self::authorOf(...), $onVersion));
        $byRange = [];

        foreach ($onVersion as $comment) {
            $byRange["{$comment->anchor->firstLine}-{$comment->anchor->lastLine}"][] = $comment;
        }

        $threads = array_map(fn (array $comments) => $this->thread($comments, $lines, $labels), array_values($byRange));

        usort($threads, fn (FileThreadData $first, FileThreadData $second) => $first->firstLine <=> $second->firstLine);

        return $threads;
    }

    public function commentAddress(): string
    {
        return $this->comments->commentAddress();
    }

    public function messageAddress(): string
    {
        return route('comments.file-tell', absolute: false);
    }

    /**
     * One range's comments as a thread: its lines, the text of those lines in the version shown, and each comment.
     *
     * @param  non-empty-list<TextCommentView>  $comments
     * @param  list<string>  $lines
     */
    private function thread(array $comments, array $lines, ActorNames $labels): FileThreadData
    {
        $anchor = $comments[0]->anchor;
        $quoted = array_slice($lines, $anchor->firstLine - 1, $anchor->lastLine - $anchor->firstLine + 1);

        return FileThreadData::from([
            'firstLine' => $anchor->firstLine,
            'lastLine' => $anchor->lastLine,
            'quote' => implode(' ', $quoted),
            'versionLabel' => $anchor->versionLabel,
            'comments' => array_map(fn (TextCommentView $comment) => FileCommentData::from([
                'id' => $comment->comment->id,
                'author' => $labels->nameOf(self::authorOf($comment)) ?? '',
                'createdAt' => $comment->comment->createdAt,
                'body' => $comment->comment->body,
            ]), $comments),
        ]);
    }

    private static function authorOf(TextCommentView $comment): ActorReference
    {
        return ActorReference::fromStored($comment->comment->authorType, $comment->comment->authorId);
    }
}
