<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Unit;

use App\Listeners\BroadcastPageChange;
use App\Providers\DomainEventServiceProvider;
use App\Support\RecordIdentity;
use Domain\Sharing\Events\ShareActivated;
use Domain\Sharing\Events\ShareCreated;
use Domain\Sharing\Events\ShareExpired;
use Domain\Sharing\Events\ShareFailed;
use Domain\Sharing\Events\ShareGatewayChanged;
use Domain\Sharing\Events\ShareRequested;
use Domain\Sharing\Events\ShareRevoked;
use Domain\Sharing\Events\ShareScopeChanged;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Tests\Fixtures\ShareFixtures;
use Domain\Sharing\Tests\TestCase;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * The owner-facing sharing events tell the owner's open pages to reread: each is mapped to the page-change broadcast,
 * a share activated in one place sends the owner's channel a page change carrying nothing, and an agent's proposal
 * alone does not.
 */
#[TimeLimit(seconds: 5, reason: 'Its commands commit for real, and it empties nine tables around each test.')]
final class SharingPageRefreshTest extends TestCase
{
    private const string RUN = '01JD8X0G9M3QZ6V4K2RUN0000A';

    public function test_every_owner_facing_sharing_event_rereads_the_owners_pages(): void
    {
        $map = new DomainEventServiceProvider($this->app)->discoverEvents();

        foreach ([
            ShareCreated::class,
            ShareActivated::class,
            ShareFailed::class,
            ShareScopeChanged::class,
            ShareRevoked::class,
            ShareExpired::class,
            ShareGatewayChanged::class,
        ] as $event) {
            $this->assertContains(
                BroadcastPageChange::class.'@handle',
                $map[$event] ?? [],
                $event,
            );
        }

        $this->assertNotContains(BroadcastPageChange::class.'@handle', $map[ShareRequested::class] ?? []);
    }

    /**
     * A share the journal's owner granted on the root for a day, kept under the root's reference.
     */
    private function grantForADay(RecordIdentity $root, ShareGatewayConfiguration $configuration): Share
    {
        $name = $root->reference();

        return $this->journal->fixtures(ShareFixtures::class)->grantForADay(
            $name,
            $root,
            $configuration,
        )->shareCalled($name);
    }
}
