<?php

declare(strict_types=1);

namespace Domain\Comments\Http\Controllers;

use App\Attributes\Bus\Dispatches;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Records\RecordResolver;
use App\Http\Responses\PageActionAnswers;
use Domain\Comments\Commands\PostComment\PostCommentCommand;
use Domain\Comments\Commands\PostTextComment\PostTextCommentCommand;
use Domain\Comments\Http\Requests\PostCommentRequest;
use Illuminate\Http\RedirectResponse;

/**
 * Posts a comment through the bus and goes back to the page with the comment's id flashed; a refusal comes back as the
 * page's errors.
 */
final readonly class PostCommentController
{
    /**
     * The flash key of the posted comment's id.
     */
    public const string POSTED_COMMENT = 'postedCommentId';

    #[Dispatches(PostCommentCommand::class)]
    #[Dispatches(PostTextCommentCommand::class)]
    public function __invoke(
        PostCommentRequest $request,
        CommandBus $commands,
        RecordResolver $records,
        PageActionAnswers $answers,
    ): RedirectResponse {
        return $answers->backWith(self::POSTED_COMMENT, $commands->run($request->command($records)));
    }
}
