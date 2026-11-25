<?php

declare(strict_types=1);

namespace Tests\Reads\Shell;

use App\Data\Notifications\NotificationPageInput;
use App\Http\Loaders\Shell\NotificationsLoader;
use Tests\Support\Entries\Attributes\TestsRead;
use Tests\TestCase;

/**
 * The owner's own notifications: with none yet the newest page is empty and names no older page.
 */
#[TestsRead(NotificationsLoader::class)]
final class NotificationsLoaderTest extends TestCase
{
    public function test_an_owner_with_no_notifications_reads_an_empty_newest_page(): void
    {
        $this->journal->owner();

        $page = $this->app->make(NotificationsLoader::class)(NotificationPageInput::validateAndCreate([]));

        $this->assertSame([[], null, 0], [$page->items, $page->nextCursor, $page->unread]);
    }
}
