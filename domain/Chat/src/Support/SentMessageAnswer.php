<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Contracts\ConversationResolver;
use App\Contracts\RequestKey;
use Domain\Chat\Exceptions\ConversationUnavailable;
use Domain\Chat\Http\Requests\ConversationRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;

/**
 * How a send or a reply from the chat answers: the page that sent it, Home or Chat's own, is shown again (303),
 * falling back to Home on the same agent; a JSON caller reads the message id and the request key it went under, and
 * only while it may still see that message.
 */
final readonly class SentMessageAnswer
{
    public function __construct(
        private ConversationResolver $conversations,
        private RequestKey $key,
        private Redirector $redirect,
    ) {}

    /**
     * @throws ConversationUnavailable when a repeated request's message is no longer visible to the caller
     */
    public function to(
        Request $request,
        string $messageId,
        string|null $agentId,
        string $inboxId,
    ): JsonResponse|RedirectResponse {
        if (! $request->expectsJson()) {
            $query = $agentId === null
                ? ConversationRequest::queryForInbox($inboxId)
                : ConversationRequest::queryFor($agentId);

            $home = $this->redirect->getUrlGenerator()->route('home', $query, false);

            return $this->redirect->back(303, [], $home);
        }

        if (! $this->conversations->canSee($messageId)) {
            throw ConversationUnavailable::sentMessageHidden();
        }

        return new JsonResponse(['messageId' => $messageId, 'requestKey' => $this->key->key()]);
    }
}
