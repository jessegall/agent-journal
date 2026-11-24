<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Pages\Resolvers;

use App\Contracts\Chat\ConversationResolver;
use App\Contracts\Navigation\PageResolver;
use App\Data\Messages\InboxView;
use App\Data\Messages\MessagePage;
use App\Enums\ActionMethod;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutFormData;
use App\Support\Layout\LayoutNativeData;
use App\Support\Layout\LayoutPartData;
use Domain\Chat\Data\InboxMessagesPartData;

/**
 * The Inbox page as a list layout: one card for every inbox the user sits at, with what is unread and what waits,
 * Take next while a question waits, and its newest messages as a native part, a bounded slice; with no inbox, a
 * notice that says so. Looking at it marks nothing read.
 */
final readonly class InboxPageResolver implements PageResolver
{
    public function __construct(private ConversationResolver $messages) {}

    public function read(): DeclaredLayoutData
    {
        $inboxes = $this->messages->ownInboxes();

        if ($inboxes === []) {
            return DeclaredLayoutData::of(LayoutPartData::box(
                'inboxes',
                'stack',
                LayoutPartData::notice('empty', 'empty', 'You sit at no inbox.'),
            ));
        }

        return DeclaredLayoutData::of(LayoutPartData::box(
            'inboxes',
            'stack',
            ...array_map(fn (InboxView $inbox) => $this->cardOf($inbox), $inboxes),
        ));
    }

    private function cardOf(InboxView $inbox): LayoutPartData
    {
        $counts = $inbox->counts;

        $header = [
            LayoutPartData::text('label', $inbox->label, 'heading'),
            LayoutPartData::text(
                'counts',
                "{$counts->unread} unread, {$counts->unclaimed} waiting, {$counts->claimed} claimed",
                'muted',
            ),
        ];

        if ($counts->unclaimed > 0) {
            $takeNext = LayoutFormData::from(
                [
                    'method' => ActionMethod::Post,
                    'href' => route('chat.take-next', [], false),
                    'fixed' => ['inboxId' => $inbox->inboxId],
                ],
            );

            $header[] = LayoutPartData::form(
                'take-next',
                $takeNext,
                'inline',
                LayoutPartData::action('send', 'Take next', LayoutActionData::submitting()),
            );
        }

        $messages = InboxMessagesPartData::from([
            'inboxId' => $inbox->inboxId,
            'messages' => $this->messages->history($inbox->inboxId, null, MessagePage::DEFAULT_LIMIT)->messages,
        ]);

        return LayoutPartData::box(
            "inbox-{$inbox->inboxId}",
            'card',
            LayoutPartData::box('header', 'row', ...$header),
            LayoutPartData::native('messages', LayoutNativeData::of('chat/InboxMessages', $messages)),
        );
    }
}
