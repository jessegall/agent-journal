<?php

declare(strict_types=1);

namespace Domain\Documents\Data;

use App\Data\Comments\CommentList;
use App\Data\Comments\TextCommentView;
use Domain\Documents\Support\MarkdownBlocks;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The props of the document-comments part: the revision on screen, the record comments are posted against, its
 * numbered lines, the comments anchored to those lines, the users the server lets feedback go to, and the address
 * feedback is sent to, which is left out where the server offers no feedback.
 */
#[TypeScript]
final class DocumentCommentsPartData extends Data
{
    /**
     * @param  list<DocumentBlockData>  $blocks
     * @param  list<DocumentThreadData>  $threads
     * @param  list<DocumentRecipientData>  $recipients
     */
    public function __construct(
        public readonly string $revision,
        public readonly string $target,
        #[DataCollectionOf(DocumentBlockData::class)]
        public readonly array $blocks,
        #[DataCollectionOf(DocumentThreadData::class)]
        public readonly array $threads,
        #[DataCollectionOf(DocumentRecipientData::class)]
        public readonly array $recipients = [],
        public readonly string|Optional $feedbackAddress = new Optional(),
    ) {}

    /**
     * The part for a document's text: the body read into the blocks the reader draws, each with the lines it came from,
     * and the comments of its page that are anchored to lines of this revision.
     *
     * @param  list<DocumentRecipientData>  $recipients
     */
    public static function of(
        string $revision,
        string $target,
        string $body,
        CommentList $comments,
        array $recipients = [],
        string|null $feedbackAddress = null,
    ): self {
        return new self(
            $revision,
            $target,
            MarkdownBlocks::of($body),
            array_values(array_map(
                fn (TextCommentView $view) => new DocumentThreadData(
                    $view->comment->id,
                    $view->anchor->firstLine,
                    $view->anchor->lastLine,
                    "{$view->comment->authorType} {$view->comment->authorId}",
                    $view->comment->body,
                ),
                array_filter(
                    $comments->comments,
                    fn (object $view) => $view instanceof TextCommentView && $view->anchor->versionLabel === $revision,
                ),
            )),
            $recipients,
            $feedbackAddress ?? new Optional(),
        );
    }
}
