<?php

declare(strict_types=1);

namespace Domain\Comments\Resolvers;

use App\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use Domain\Comments\Contracts\PublicCommentResolver;
use Domain\Comments\Models\Comment;
use Domain\Comments\Support\PublicComment;
use Domain\Comments\Support\PublicCommentPage;

/**
 * A parent's comments for a public share, oldest first with the id breaking ties, each read as an excerpt the
 * database cuts, never as its whole body. The position of the last comment of a page is where the next starts.
 */
final readonly class PublicComments implements PublicCommentResolver
{
    public function pageOf(RecordIdentity $parent, int $limit, string|null $after): PublicCommentPage
    {
        $size = max(1, min($limit, self::LARGEST_PAGE));
        $query = Comment::query()->publiclyOrderedOn($parent->type, $parent->id);

        if ($after !== null) {
            [$writtenAt, $id] = explode('|', $after, 2) + [1 => ''];
            $query->writtenAfter(CarbonImmutable::parse($writtenAt), $id);
        }

        $rows = $query->excerpts(self::EXCERPT_CHARACTERS)->readExactly($size + 1)->get();
        $shown = $rows->take($size);
        $last = $shown->last();

        return new PublicCommentPage(
            array_values(
                $shown->map(
                    fn (Comment $comment) => new PublicComment(
                        $comment->shareIdentity(),
                        $comment->created_at->toIso8601String(),
                        (string) $comment->getAttribute('excerpt'),
                        $comment->quote,
                    ),
                )->all(),
            ),
            $rows->count() > $size
                && $last !== null
                ? $last->created_at->format('Y-m-d\\TH:i:s.uP').'|'.$last->id
                : null,
        );
    }
}
