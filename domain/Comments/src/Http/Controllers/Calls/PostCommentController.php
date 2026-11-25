<?php

declare(strict_types=1);

namespace Domain\Comments\Http\Controllers\Calls;

use App\Contracts\Bus\CommandBus;
use App\Contracts\Records\RecordResolver;
use App\Support\RecordReference;
use Domain\Comments\Calls\CommentPosted;
use Domain\Comments\Calls\PostCommentCall;
use Domain\Comments\Commands\PostComment\PostCommentCommand;
use Domain\Comments\Commands\PostTextComment\PostTextCommentCommand;
use Domain\Comments\Exceptions\CommentPlaceUnclear;

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
