<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Communication\Commands\ReplyToMessage;
use Domain\Chat\Data\ReplyInput;
use Domain\Chat\Support\SentMessageAnswer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

/**
 * Replies from the chat once per request key, bound to the message, the version shown, the text and the agent.
 */
final readonly class ReplyController
{
    /**
     * Replies at the version the user saw; a message that changed since is refused and the page shows it anew.
     */
    public function __invoke(
        ReplyInput $input,
        Request $request,
        CommandBus $commands,
        SentMessageAnswer $answer,
    ): JsonResponse|RedirectResponse {
        $replyId = $commands->run(
            new ReplyToMessage($input->messageId, $input->stateVersion, $input->body, $input->agent),
        );

        return $answer->to($request, $replyId, $input->agent);
    }
}
