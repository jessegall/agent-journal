<?php

declare(strict_types=1);

namespace Tests\Unit\Sharing;

use App\Events\Sharing\ShareActivated;
use App\Events\Sharing\ShareCreated;
use App\Events\Sharing\ShareExpired;
use App\Events\Sharing\ShareFailed;
use App\Events\Sharing\ShareGatewayChanged;
use App\Events\Sharing\ShareRequested;
use App\Events\Sharing\ShareRevoked;
use App\Events\Sharing\ShareScopeChanged;
use App\Listeners\BroadcastPageChange;
use App\Models\Sharing\Share;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Providers\DomainEventServiceProvider;
use App\Support\RecordIdentity;
use Tests\Commands\Sharing\SharingTestCase;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * The owner-facing sharing events tell the owner's open pages to reread: each is mapped to the page-change broadcast,
 * a share activated in one place sends the owner's channel a page change carrying nothing, and an agent's proposal
 * alone does not.
 */
#[TimeLimit(seconds: 5, reason: 'Its commands commit for real, and it empties nine tables around each test.')]
final class SharingPageRefreshTest extends SharingTestCase
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

        return $this->journal->shareForADay(
            $name,
            $root,
            $configuration,
        )->shareCalled($name);
    }
}
