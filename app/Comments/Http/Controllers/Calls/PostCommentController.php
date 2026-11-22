<?php

declare(strict_types=1);

namespace App\Comments\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Comments\Calls\CommentPosted;
use App\Comments\Calls\PostCommentCall;
use App\Comments\Commands\PostComment\PostCommentCommand;
use App\Comments\Commands\PostTextComment\PostTextCommentCommand;
use App\Comments\Exceptions\CommentPlaceUnclear;
use App\Numbers\Support\RecordReference;
use App\Records\Contracts\RecordResolver;

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
