<?php

declare(strict_types=1);

namespace Domain\Reminders\Http\Pages\Resolvers;

use App\Exceptions\ActorNotAllowed;
use App\Navigation\Contracts\PageResolver;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\ListEmpty;
use App\Support\Layout\ListPaging;
use Domain\Reminders\Http\Requests\RemindersRequest;
use Domain\Reminders\Resolvers\Support\OwnReminders;
use Domain\Reminders\Values\ReminderCard;

/**
 * The reminders window: the caller's own reminders with their due time and status, the No reminders yet empty state
 * when there are none, and Reminders unavailable for a caller who may not read them.
 */
final readonly class RemindersWindowResolver implements PageResolver
{
    public function __construct(private OwnReminders $reminders, private RemindersRequest $request) {}

    public function read(): DeclaredLayoutData
    {
        try {
            $page = $this->reminders->own($this->request->pageNumber());
        } catch (ActorNotAllowed) {
            return $this->window(LayoutPartData::notice(
                'unavailable',
                'empty',
                'Reminders unavailable',
                'You may not read reminders here.',
            ));
        }

        if ($page->cards === []) {
            return $this->window(ListEmpty::nothingYet(
                'No reminders yet',
                'A reminder brings something back to you or an agent at the time you choose.',
                'bell',
            )->page());
        }

        return $this->window(
            LayoutPartData::collection('reminders', 'list', array_map(
                fn (ReminderCard $card) => LayoutRowData::from([
                    'key' => $card->id,
                    'label' => $card->title,
                    'trailing' => [
                        LayoutPartData::time('due', 'Due', $card->dueAt->toIso8601String()),
                        LayoutPartData::badge('status', $card->status->label()),
                    ],
                ]),
                $page->cards,
            )),
            ...ListPaging::numbered($page->page, $page->lastPage())->parts(),
        );
    }

    private function window(LayoutPartData ...$parts): DeclaredLayoutData
    {
        return DeclaredLayoutData::of(LayoutPartData::box(
            'reminders',
            'stack',
            LayoutPartData::text('title', 'Reminders', 'heading'),
            ...$parts,
        ));
    }
}
