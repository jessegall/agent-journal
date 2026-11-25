<?php

declare(strict_types=1);

namespace Tests\Commands\Access;

use App\Commands\Access\GrantEnvironmentAccess\GrantEnvironmentAccessCommand;
use App\Enums\Messages\InboxPermission;
use App\Models\Access\EnvironmentUserGrant;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Seeding\SeedsJournal;
use Tests\TestCase;

/**
 * The owner grants a user access to the journal with what they may do, kept with who granted it; a second grant
 * replaces the first, which is kept as revoked.
 */
final class GrantEnvironmentAccessTest extends TestCase
{
    use RefreshHookDatabase;
    use SeedsJournal;

    public function test_a_grant_keeps_its_permissions_and_a_second_replaces_the_first(): void
    {
        $this->journal()->owner()->user('Guest');
        $guestId = $this->journal()->userCalled('Guest')->id;

        $this->journal()->run(new GrantEnvironmentAccessCommand($guestId, null, [InboxPermission::OpenInboxes]));
        $this->journal()->run(new GrantEnvironmentAccessCommand($guestId, null, [InboxPermission::ManageMembers]));

        $grants = EnvironmentUserGrant::query()->where('user_id', $guestId)->orderBy('granted_at')->orderBy('id')->get();
        $active = $grants->whereNull('revoked_at')->sole();
        $this->assertSame(2, $grants->count());
        $this->assertSame(
            [false, true, $this->journal()->ownerUser()->id],
            [$active->can_open_inboxes, $active->can_manage_members, $active->granted_by_id],
        );
    }
}
