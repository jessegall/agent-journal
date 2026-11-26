<?php

declare(strict_types=1);

namespace Tests\Reads\Shell;

use App\Http\Loaders\Shell\NotificationsLoader;
use App\Notifications\Data\NotificationPageInput;
use Tests\Support\Entries\Attributes\TestsRead;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The owner's own notifications: with none yet the newest page is empty and names no older page.
 */
#[TestsRead(NotificationsLoader::class)]
final class NotificationsLoaderTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_an_owner_with_no_notifications_reads_an_empty_newest_page(): void
    {
        $this->journal->owner();

        $page = $this->app->make(NotificationsLoader::class)(NotificationPageInput::validateAndCreate([]));

        $this->assertSame([[], null, 0], [$page->items, $page->nextCursor, $page->unread]);
    }
}
