<?php

declare(strict_types=1);

namespace Domain\Chat\Support;

use App\Contracts\ConversationResolver;
use App\Contracts\RequestKey;
use Domain\Chat\Exceptions\ConversationUnavailable;
use Domain\Chat\Http\Requests\ConversationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;
use Inertia\ResponseFactory;

/**
 * How a send or a reply from the chat answers: the page that sent it, Home or Chat's own, is shown again (303),
 * falling back to Home on the same agent, with the message id and the request key it went under flashed, and only
 * while the sender may still see that message.
 */
final readonly class SentMessageAnswer
{
    /**
     * The flash key of the sent message's id.
     */
    public const string SENT_MESSAGE = 'sentMessageId';

    /**
     * The flash key of the request key the message went under.
     */
    public const string REQUEST_KEY = 'sentRequestKey';

    public function __construct(
        private ConversationResolver $conversations,
        private RequestKey $key,
        private Redirector $redirect,
        private ResponseFactory $inertia,
    ) {}

    /**
     * @throws ConversationUnavailable when a repeated request's message is no longer visible to the caller
     */
    public function to(string $messageId, string|null $agentId, string $inboxId): RedirectResponse
    {
        if (! $this->conversations->canSee($messageId)) {
            throw ConversationUnavailable::sentMessageHidden();
        }

        $query = $agentId === null
            ? ConversationRequest::queryForInbox($inboxId)
            : ConversationRequest::queryFor($agentId);

        $home = $this->redirect->getUrlGenerator()->route('home', $query, false);

        $this->inertia->flash([self::SENT_MESSAGE => $messageId, self::REQUEST_KEY => $this->key->key()]);

        return $this->redirect->back(303, [], $home);
    }
}
