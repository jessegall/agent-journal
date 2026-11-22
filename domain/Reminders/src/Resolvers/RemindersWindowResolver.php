<?php

declare(strict_types=1);

namespace Domain\Reminders\Resolvers;

use App\Ui\Contracts\PageResolver;
use App\Ui\Layout\DeclaredLayoutData;
use App\Ui\Layout\LayoutPartData;

/**
 * The reminders window: no read provider that a user may see exists yet, so it says reminders are unavailable rather
 * than showing an empty list that would look like no reminders.
 */
final readonly class RemindersWindowResolver implements PageResolver
{
    public function read(): DeclaredLayoutData
    {
        return DeclaredLayoutData::of(LayoutPartData::box(
            'reminders',
            'stack',
            LayoutPartData::text('title', 'Reminders', 'heading'),
            LayoutPartData::notice(
                'unavailable',
                'empty',
                'Reminders unavailable',
                'No read of reminders is available to you here yet.',
            ),
        ));
    }
}
