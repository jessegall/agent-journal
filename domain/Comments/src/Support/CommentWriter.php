<?php

declare(strict_types=1);

namespace Domain\Comments\Support;

use App\Contracts\Reads\TextContent;
use App\Contracts\Records\Commentable;
use App\Contracts\Records\RecordResolver;
use App\Exceptions\SubmissionKeyConflict;
use App\Exceptions\TargetHasNoText;
use App\Support\ActorReference;
use App\Support\MarkdownText;
use App\Support\RecordIdentity;
use App\Values\TextRange;
use Domain\Comments\Enums\WholeRecord;
use Domain\Comments\Exceptions\TargetNotCommentable;
use Domain\Comments\Models\Comment;
use Illuminate\Database\Eloquent\Model;

/**
 * Writes a comment for the author it is given: the record is authorized first, a retry under the same submission key
 * returns the first comment, and listeners receive it once it commits.
 */
final readonly class CommentWriter
{
    public function __construct(
        private RecordResolver $records,
    ) {}

    public function post(
        RecordIdentity $targetIdentity,
        string $text,
        WholeRecord|TextRange $subject,
        string $submissionKey,
        ActorReference $actor,
    ): string {
        $target = $this->records->requireReadable($targetIdentity);

        if (! $target instanceof Commentable) {
            throw TargetNotCommentable::for($targetIdentity->type);
        }

        $body = MarkdownText::comment($text);
        $author = $actor;
        $hash = self::hashOf($targetIdentity, $subject, $body);
        $earlier = Comment::query()->submittedAs($author, $submissionKey)->first();

        if ($earlier !== null) {
            if ($earlier->submission_hash === $hash) {
                return $earlier->id;
            }

            throw SubmissionKeyConflict::for($submissionKey);
        }

        $comment = $subject instanceof TextRange
            ? Comment::create(
                $target,
                $author,
                $body,
                $subject->anchorIn(self::textOf($target, $targetIdentity)->textVersion($subject->version)),
                $submissionKey,
                $hash,
            )
            : Comment::create($target, $author, $body, null, $submissionKey, $hash);

        return $comment->id;
    }

    private static function textOf(Model $target, RecordIdentity $targetIdentity): TextContent
    {
        if ($target instanceof TextContent) {
            return $target;
        }

        throw TargetHasNoText::for($targetIdentity->type);
    }

    /**
     * What the submission key stands for: whether it is about the record or its text, the target, the
     * exact body and every field of the place it points at.
     */
    private static function hashOf(RecordIdentity $targetIdentity, WholeRecord|TextRange $subject, string $body): string
    {
        $subjectFields = $subject instanceof WholeRecord
            ? ['record']
            : [
                'text',
                $subject->version,
                $subject->type->value,
                $subject->sectionNumber,
                $subject->firstLine,
                $subject->lastLine,
                $subject->quote,
                $subject->startOffset,
                $subject->endOffset,
            ];

        $fields = ['comment', $subjectFields, $targetIdentity->type, $targetIdentity->id, $body];

        return hash('sha256', (string) json_encode($fields));
    }
}
