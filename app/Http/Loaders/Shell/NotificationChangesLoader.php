<?php

declare(strict_types=1);

namespace App\Http\Loaders\Shell;

use App\Actors\Contracts\CurrentActor;
use App\Notifications\Data\NotificationChangePage;
use App\Notifications\Data\NotificationChangesInput;
use App\Resolvers\Support\NotificationChanges;

/**
 * What changed in the viewer's own notifications since a cursor; a cursor of another scope is refused as an invalid
 * cursor.
 */
final readonly class NotificationChangesLoader
{
    public function __construct(private NotificationChanges $changes, private CurrentActor $actors) {}

    public function __invoke(NotificationChangesInput $input): NotificationChangePage
    {
        return $this->changes->since($this->actors->actor(), $input->since);
    }
}
