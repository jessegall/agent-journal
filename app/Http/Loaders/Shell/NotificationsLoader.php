<?php

declare(strict_types=1);

namespace App\Http\Loaders\Shell;

use App\Actors\Contracts\CurrentActor;
use App\Notifications\Data\NotificationPage;
use App\Notifications\Data\NotificationPageInput;
use App\Resolvers\Support\NotificationFeed;

/**
 * A page of the viewer's own notifications: the newest, or an older one by its cursor; a cursor of another scope is
 * refused as an invalid cursor.
 */
final readonly class NotificationsLoader
{
    public function __construct(private NotificationFeed $feed, private CurrentActor $actors) {}

    public function __invoke(NotificationPageInput $input): NotificationPage
    {
        return $this->feed->page($this->actors->actor(), $input->cursor);
    }
}
