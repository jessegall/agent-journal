<?php

declare(strict_types=1);

namespace App\Http\Loaders\Shell;

use App\Contracts\Actors\CurrentActor;
use App\Data\Notifications\NotificationPage;
use App\Data\Notifications\NotificationPageInput;
use App\Resolvers\Support\NotificationFeed;
use App\Support\ActorReference;

/**
 * A page of the viewer's own notifications: the newest, or an older one by its cursor; a cursor of another scope is
 * refused as an invalid cursor.
 */
final readonly class NotificationsLoader
{
    public function __construct(private NotificationFeed $feed, private CurrentActor $actors) {}

    public function __invoke(NotificationPageInput $input): NotificationPage
    {
        return $this->feed->page(ActorReference::of($this->actors->actor()), $input->cursor);
    }
}
