<?php

declare(strict_types=1);

namespace Domain\Chat\Resolvers;

use App\Contracts\Chat\ConversationResolver;
use App\Contracts\Navigation\PageResolver;
use App\Data\MessagePage;
use App\Data\MessageView;
use App\Enums\ActionMethod;
use App\Enums\MessageState;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutFieldData;
use App\Support\Layout\LayoutFormData;
use App\Support\Layout\LayoutPartData;
use Domain\Chat\Http\Requests\HistoryRequest;

/**
 * The History page as a list layout of one inbox, a bounded page at a time, oldest first within it: an inbox the
 * reader sits at as its own history, any other as an inspection the policy must admit and the page labels. Each
 * waiting message can be cancelled with a reason, and older messages follow from the window's cursor. Neither marks
 * anything read or takes anything up; with no inbox chosen, the page says to choose one.
 */
final readonly class HistoryPageResolver implements PageResolver
{
    public function __construct(
        private HistoryRequest $request,
        private ConversationResolver $messages,
    ) {}

    public function read(): DeclaredLayoutData
    {
        if ($this->request->chosenInbox()->isEmpty()) {
            return DeclaredLayoutData::of(LayoutPartData::box(
                'history',
                'stack',
                LayoutPartData::notice('empty', 'empty', 'Choose an inbox to read its history.'),
            ));
        }

        $inboxId = $this->request->chosenInbox()->get();
        $isOwnInbox = $this->messages->sitsAt($inboxId);
        $olderCursor = $this->request->olderCursor();

        $page = $isOwnInbox
            ? $this->messages->history($inboxId, $olderCursor, MessagePage::DEFAULT_LIMIT)
            : $this->messages->inspect($inboxId, $olderCursor, MessagePage::DEFAULT_LIMIT);

        $parts = [];

        if (! $isOwnInbox) {
            $parts[] = LayoutPartData::notice(
                'inspection',
                'info',
                'Inspection: you do not sit at this inbox, and reading it here marks nothing read.',
            );
        }

        $parts[] = $page->messages === []
            ? LayoutPartData::notice('no-messages', 'empty', 'This inbox has no messages yet.')
            : LayoutPartData::box(
                'messages',
                'stack',
                ...array_map(fn (MessageView $message) => $this->messageOf($message), $page->messages),
            );

        if ($page->olderCursor !== null) {
            $older = LayoutActionData::changing(['older' => $page->olderCursor]);
            $parts[] = LayoutPartData::action('older', 'Older messages', $older);
        }

        return DeclaredLayoutData::of(LayoutPartData::box('history', 'stack', ...$parts));
    }

    /**
     * One message as a card: who sent it where, its text, and while it waits for an answer the form that cancels it
     * with a reason.
     */
    private function messageOf(MessageView $message): LayoutPartData
    {
        $parts = [
            LayoutPartData::text(
                'route',
                ($message->authorLabel ?? $message->sourceInboxLabel)." to {$message->destinationInboxLabel}",
                'muted',
            ),
            LayoutPartData::text('body', $message->body, 'paragraph'),
        ];

        if ($message->state === MessageState::WaitingForAnswer) {
            $parts[] = LayoutPartData::form(
                'cancel',
                new LayoutFormData(ActionMethod::Post, route('chat.cancel', [], false), ['messageId' => $message->id]),
                'inline',
                LayoutPartData::field('reason', 'Reason for cancelling', new LayoutFieldData('reason'), 'text'),
                LayoutPartData::action('send', 'Cancel', LayoutActionData::submitting()),
            );
        }

        return LayoutPartData::box($message->id, 'card', ...$parts);
    }
}
