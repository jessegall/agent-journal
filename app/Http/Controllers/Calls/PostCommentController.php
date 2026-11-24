<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Comments\CommentPosted;
use App\Calls\Comments\PostCommentCall;
use App\Commands\Comments\PostComment\PostCommentCommand;
use App\Commands\Comments\PostTextComment\PostTextCommentCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Records\RecordResolver;
use App\Exceptions\CommentPlaceUnclear;
use App\Support\RecordReference;

/**
 * Posts an agent's comment on the whole record or on the place it names.
 */
final readonly class PostCommentController
{
    /**
     * @throws CommentPlaceUnclear
     */
    public function __invoke(PostCommentCall $call, CommandBus $commands, RecordResolver $records): CommentPosted
    {
        $target = $records->identify(RecordReference::parse($call->target));

        $command = $call->place === null
            ? new PostCommentCommand($target, $call->body, $call->submissionKey)
            : new PostTextCommentCommand($target, $call->body, $call->place->range(), $call->submissionKey);

        return CommentPosted::from(['comment' => $commands->run($command)]);
    }
}
