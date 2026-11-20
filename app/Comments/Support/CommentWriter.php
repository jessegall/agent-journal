<?php

declare(strict_types=1);

namespace App\Comments\Support;

use App\Actors\Contracts\WorkStacks;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Comments\Contracts\Commentable;
use App\Comments\Enums\WholeRecord;
use App\Comments\Events\CommentPosted;
use App\Comments\Exceptions\SubmissionKeyConflict;
use App\Comments\Exceptions\TargetNotCommentable;
use App\Comments\Models\Comment;
use App\Records\Contracts\RecordResolver;
use App\Records\Support\RecordIdentity;
use App\Text\Contracts\TextContent;
use App\Text\Exceptions\TargetHasNoText;
use App\Text\Support\MarkdownText;
use App\Text\Values\TextRange;
use Illuminate\Database\Eloquent\Model;

/**
 * Writes a comment for the author it is given: the record is authorized first, a retry under the same submission key
 * returns the first comment, and listeners receive it once it commits.
 */
final readonly class CommentWriter
{
    public function __construct(
        private RecordResolver $records,
        private WorkStacks $workStacks,
        private CommentEvents $events,
    ) {}

    public function post(
        RecordIdentity $targetIdentity,
        string $text,
        WholeRecord|TextRange $subject,
        string $submissionKey,
        ActorContext $actor,
    ): string {
        $target = $this->records->requireReadable($targetIdentity);

        if (! $target instanceof Commentable) {
            throw TargetNotCommentable::for($targetIdentity->type);
        }

        $body = MarkdownText::comment($text);
        $author = ActorIdentity::of($actor);
        $sessionId = $this->workStacks->sessionsToAdmit()[0] ?? null;
        $hash = self::hashOf($targetIdentity, $subject, $body);
        $earlier = Comment::query()->submittedAs($author, $sessionId, $submissionKey)->first();

        if ($earlier !== null) {
            return $earlier->submission_hash === $hash
                ? $earlier->id
                : throw SubmissionKeyConflict::for($submissionKey);
        }

        $comment = $subject instanceof TextRange
            ? Comment::postOnText(
                $target,
                $author,
                $sessionId,
                $body,
                $subject->anchorIn(self::textOf($target, $targetIdentity)->textVersion($subject->version)),
                $submissionKey,
                $hash,
            )
            : Comment::postOnRecord($target, $author, $sessionId, $body, $submissionKey, $hash);
        $this->events->posted(new CommentPosted($comment->id, $targetIdentity));

        return $comment->id;
    }

    private static function textOf(Model $target, RecordIdentity $targetIdentity): TextContent
    {
        return $target instanceof TextContent ? $target : throw TargetHasNoText::for($targetIdentity->type);
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
