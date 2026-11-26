<?php

declare(strict_types=1);

namespace Domain\Comments\Http\Controllers\Api;

use App\Contracts\Records\RecordResolver;
use App\Support\RecordReference;
use App\Support\TextSelection;
use Domain\Comments\Api\CommentLocated;
use Domain\Comments\Api\LocateCommentPayload;
use Domain\Comments\Contracts\CommentResolver;

/**
 * Answers where a comment points, with the lines asked for when it points at text.
 */
final readonly class LocateCommentController
{
    public function __invoke(
        LocateCommentPayload $call,
        CommentResolver $comments,
        RecordResolver $records,
    ): CommentLocated {
        $target = $records->identify(RecordReference::parse($call->target));

        $selection = $call->firstLine === null
            ? TextSelection::from([])
            : TextSelection::from(['firstLine' => $call->firstLine, 'lastLine' => (int) $call->lastLine]);

        return CommentLocated::from($comments->location($target, $call->comment, $selection)->toArray());
    }
}
