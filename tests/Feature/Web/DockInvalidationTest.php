<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Domains\Providers\DomainEventServiceProvider;
use App\Sharing\Events\ShareRevoked;
use App\Web\Events\ProtectedViewInvalidated;
use App\Web\Listeners\BroadcastPageChange;
use App\Web\Listeners\BroadcastProtectedViewInvalidation;
use Domain\Chat\Events\DockChanged;
use Tests\TestCase;

/**
 * A dock change rereads both sides' pages through the page change, a revoked share sends every open page the signal
 * to drop what it shows first, and neither signal carries anything about the source.
 */
final class DockInvalidationTest extends TestCase
{
    public function test_a_dock_change_rereads_the_pages_and_a_revoked_share_drops_what_they_show(): void
    {
        $map = new DomainEventServiceProvider($this->app)->discoverEvents();

        $this->assertContains(BroadcastPageChange::class.'@handle', $map[DockChanged::class] ?? []);
        $this->assertContains(BroadcastProtectedViewInvalidation::class.'@handle', $map[ShareRevoked::class] ?? []);
    }

    public function test_the_protected_view_signal_names_nothing(): void
    {
        $signal = new ProtectedViewInvalidated(['01jd8x0g9m3qz6v4k2t7r5w1ce']);

        $this->assertSame([], $signal->broadcastWith());
        $this->assertSame(ProtectedViewInvalidated::NAME, $signal->broadcastAs());
    }
}
