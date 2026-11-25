<?php

declare(strict_types=1);

namespace Tests\Reads\Shell;

use App\Contracts\Refusals\FieldRefusal;
use App\Data\Notifications\NotificationChangesInput;
use App\Exceptions\NotificationCursorInvalid;
use App\Http\Loaders\Shell\NotificationChangesLoader;
use Tests\Support\Entries\Attributes\TestsRead;
use Tests\TestCase;

/**
 * The changes of the owner's notifications since a cursor; a cursor not of the owner's own scope is refused as an
 * invalid cursor, which a loader call answers as the cursor field's error.
 */
#[TestsRead(NotificationChangesLoader::class)]
final class NotificationChangesLoaderTest extends TestCase
{
    public function test_a_cursor_of_another_scope_is_refused_as_an_invalid_cursor(): void
    {
        $this->journal->owner();

        try {
            $this->app->make(NotificationChangesLoader::class)(
                NotificationChangesInput::validateAndCreate(['since' => 'another-scope-cursor']),
            );
            $this->fail('A foreign cursor was read.');
        } catch (NotificationCursorInvalid $refusal) {
            $this->assertInstanceOf(FieldRefusal::class, $refusal);
            $this->assertSame(['cursor'], array_keys($refusal->fieldErrors()));
        }
    }
}
