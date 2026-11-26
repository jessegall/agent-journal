<?php

declare(strict_types=1);

namespace Domain\Comments\Http\Controllers\Api;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Records\Contracts\RecordResolver;
use App\Support\RecordReference;
use Domain\Comments\Api\CommentPosted;
use Domain\Comments\Api\PostCommentPayload;
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
    #[Dispatches(PostCommentCommand::class)]
    #[Dispatches(PostTextCommentCommand::class)]
    public function __invoke(PostCommentPayload $call, CommandBus $commands, RecordResolver $records): CommentPosted
    {
        $target = $records->identify(RecordReference::parse($call->target));

        $command = $call->place === null
            ? new PostCommentCommand($target, $call->body, $call->submissionKey)
            : new PostTextCommentCommand($target, $call->body, $call->place->range(), $call->submissionKey);

        return CommentPosted::from(['comment' => $commands->run($command)]);
    }
}
