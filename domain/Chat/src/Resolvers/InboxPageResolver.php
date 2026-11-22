<?php

declare(strict_types=1);

namespace Domain\Chat\Resolvers;

use App\Communication\Contracts\ConversationResolver;
use App\Communication\Data\InboxView;
use App\Communication\Data\MessagePage;
use App\Ui\Contracts\PageResolver;
use App\Ui\Enums\ActionMethod;
use App\Ui\Layout\DeclaredLayoutData;
use App\Ui\Layout\LayoutActionData;
use App\Ui\Layout\LayoutFormData;
use App\Ui\Layout\LayoutNativeData;
use App\Ui\Layout\LayoutPartData;
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
                "{$counts->unread} unread, {$counts->unclaimed} waiting, {$counts->claimed} taken up",
                'muted',
            ),
        ];

        if ($counts->unclaimed > 0) {
            $takeNext = new LayoutFormData(
                ActionMethod::Post,
                route('chat.take-next', [], false),
                ['inboxId' => $inbox->inboxId],
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
