<?php

declare(strict_types=1);

namespace Domain\Reminders\Http\Pages;

use App\Exceptions\ActorNotAllowed;
use App\Reads\PageFormRequests;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\EmptyListState;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\ListPaging;
use App\Web\Creation\Contracts\PageBuilder;
use Domain\Reminders\Http\Requests\RemindersRequest;
use Domain\Reminders\Resolvers\Support\OwnReminders;
use Domain\Reminders\Values\ReminderCard;
use Illuminate\Http\Request;

/**
 * The reminders window: the caller's own reminders with their due time and status, the No reminders yet empty state
 * when there are none, and Reminders unavailable for a caller who may not read them.
 */
final readonly class RemindersPageBuilder implements PageBuilder
{
    public const string EMPTY_TITLE = 'No reminders yet';

    public const string EMPTY_DETAIL = 'A reminder brings something back to you or an agent at the time you choose.';

    public function __construct(private OwnReminders $reminders, private PageFormRequests $requests) {}

    public function build(Request $visit): RemindersPageData
    {
        return RemindersPageData::build()->shown($this->content($visit))->finish();
    }

    private function content(Request $visit): DeclaredLayoutData
    {
        $input = $this->requests->from(RemindersRequest::class, $visit);

        try {
            $page = $this->reminders->own($input->pageNumber());
        } catch (ActorNotAllowed) {
            return $this->window(LayoutPartData::build()
                ->asNotice()
                ->key('unavailable')
                ->style('empty')
                ->title('Reminders unavailable')
                ->detail('You may not read reminders here.')
                ->finish());
        }

        if ($page->cards === []) {
            return $this->window(EmptyListState::build()
                ->title(self::EMPTY_TITLE)
                ->detail(self::EMPTY_DETAIL)
                ->icon('bell')
                ->fillsPage(true)
                ->finish()->page());
        }

        return $this->window(
            LayoutPartData::build()
                ->asCollection()
                ->key('reminders')
                ->style('list')
                ->rows(
                    array_map(
                        fn (ReminderCard $card) => LayoutRowData::build()
                            ->key($card->id)
                            ->label($card->title)
                            ->trailing(
                                [
                                    LayoutPartData::build()
                                        ->asTime()
                                        ->key('due')
                                        ->label('Due')
                                        ->detail($card->dueAt->toIso8601String())
                                        ->finish(),
                                    LayoutPartData::build()
                                        ->asBadge()
                                        ->key('status')
                                        ->text($card->status->label())
                                        ->finish(),
                                ],
                            )
                            ->finish(),
                        $page->cards,
                    ),
                )
                ->finish(),
            ...ListPaging::build()->page($page->page)->lastPage($page->lastPage())->finish()->parts(),
        );
    }

    private function window(LayoutPartData ...$parts): DeclaredLayoutData
    {
        return DeclaredLayoutData::build()
            ->root(
                LayoutPartData::build()
                    ->asBox()
                    ->key('reminders')
                    ->style('stack')
                    ->children(
                        LayoutPartData::build()->asText()->key('title')->value('Reminders')->style('heading')->finish(),
                        ...$parts,
                    )
                    ->finish(),
            )
            ->finish();
    }
}
