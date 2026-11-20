<?php

declare(strict_types=1);

namespace App\Comments\Http\Controllers\Calls;

use App\Comments\Calls\CommentLocated;
use App\Comments\Calls\LocateCommentCall;
use App\Comments\Contracts\CommentResolver;
use App\Numbers\Support\RecordReference;
use App\Records\Contracts\RecordResolver;
use App\Text\Support\TextSelection;

/**
 * Answers where a comment points, with the lines asked for when it points at text.
 */
final readonly class LocateCommentController
{
    public function __invoke(
        LocateCommentCall $call,
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
