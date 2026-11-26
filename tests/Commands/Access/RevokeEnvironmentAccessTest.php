<?php

declare(strict_types=1);

namespace Tests\Commands\Access;

use App\Access\Commands\GrantEnvironmentAccess\GrantEnvironmentAccessCommand;
use App\Access\Commands\RevokeEnvironmentAccess\RevokeEnvironmentAccessCommand;
use App\Messages\Enums\InboxPermission;
use App\Models\Access\EnvironmentUserGrant;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The owner revokes a user's access, which keeps the grant as revoked; revoking a user with no access changes nothing.
 */
#[TestsCommand(RevokeEnvironmentAccessCommand::class)]
final class RevokeEnvironmentAccessTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_revoked_grant_is_kept_as_revoked_and_a_second_revoke_changes_nothing(): void
    {
        $this->journal->owner()->user('Guest');
        $guestId = $this->journal->userCalled('Guest')->id;
        $this->journal->run(new GrantEnvironmentAccessCommand($guestId, null, [InboxPermission::OpenInboxes]));

        $this->journal->run(new RevokeEnvironmentAccessCommand($guestId, null));
        $this->journal->run(new RevokeEnvironmentAccessCommand($guestId, null));

        $grant = EnvironmentUserGrant::query()->where('user_id', $guestId)->sole();
        $this->assertNotNull($grant->revoked_at);
    }
}
