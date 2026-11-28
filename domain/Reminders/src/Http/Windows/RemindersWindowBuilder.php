<?php

declare(strict_types=1);

namespace Domain\Reminders\Http\Windows;

use App\Reads\PageFormRequests;
use App\Support\Layout\LayoutRowData;
use App\Web\Creation\Contracts\WindowBuilder;
use App\Web\Creation\SurfaceAttributeMap;
use Domain\Reminders\Data\RemindersPaneData;
use Domain\Reminders\Http\Requests\RemindersRequest;
use Domain\Reminders\Resolvers\Support\OwnReminders;
use Domain\Reminders\Values\ReminderCard;
use Illuminate\Http\Request;

final readonly class RemindersWindowBuilder implements WindowBuilder
{
    public function __construct(
        private PageFormRequests $requests,
        private SurfaceAttributeMap $policies,
        private OwnReminders $reminders,
    ) {}

    public function build(Request $visit): RemindersPaneData
    {
        $input = $this->requests->from(RemindersRequest::class, $visit);
        $policy = $this->policies->forType(RemindersPaneData::class);
        $cards = $this->reminders->preview($policy->limitFor('items'));

        return RemindersPaneData::build()
            ->items(array_map(
                fn (ReminderCard $card) => LayoutRowData::build()
                    ->key($card->id)
                    ->label($card->title)
                    ->detail($card->dueAt->toIso8601String())
                    ->value($card->status->label())
                    ->finish(),
                $cards,
            ))
            ->fullUrl(route('reminders.list', ['page' => $input->pageNumber()], false))
            ->finish();
    }
}
