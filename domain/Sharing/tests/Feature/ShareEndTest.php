<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Feature;

use Domain\Sharing\Enums\ShareState;
use Domain\Sharing\Events\ShareExpired;
use Domain\Sharing\Events\ShareRevoked;
use Domain\Sharing\Exceptions\ShareEndInvalid;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\Sharing\TestShares;
use Tests\Support\TestActors;

/**
 * A share ends once, as revoked or expired: the end clears its token, keeps its digest, and raises one fact whose time
 * is the share's terminal time; a second end of either kind changes nothing and raises nothing.
 */
final class ShareEndTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_revoking_then_expiring_ends_the_share_once_with_one_time_and_one_fact(): void
    {
        $share = $this->share();
        $share->takeRaisedEvents();

        $this->assertTrue($share->end(ShareState::Revoked));
        $raised = $share->takeRaisedEvents();
        $this->assertFalse($share->end(ShareState::Expired));

        $fresh = $share->fresh();
        $this->assertSame(ShareState::Revoked, $fresh?->state);
        $this->assertNull($fresh->token_ciphertext);
        $this->assertNotNull($fresh->token_digest);
        $this->assertCount(1, $raised);
        $this->assertInstanceOf(ShareRevoked::class, $raised[0]);
        $this->assertSame($fresh->terminal_at->getTimestamp(), $raised[0]->share->occurredAt->getTimestamp());
        $this->assertSame([], $share->takeRaisedEvents());
    }

    public function test_expiring_then_revoking_ends_the_share_once_as_expired(): void
    {
        $share = $this->share();
        $share->takeRaisedEvents();

        $this->assertTrue($share->end(ShareState::Expired));
        $this->assertFalse($share->end(ShareState::Revoked));

        $raised = $share->takeRaisedEvents();
        $this->assertSame(ShareState::Expired, $share->fresh()?->state);
        $this->assertCount(1, $raised);
        $this->assertInstanceOf(ShareExpired::class, $raised[0]);
    }

    public function test_a_state_that_is_no_end_is_refused_by_name(): void
    {
        $share = $this->share();

        $this->expectException(ShareEndInvalid::class);

        $share->end(ShareState::Active);
    }

    private function share(): Share
    {
        $configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());

        return TestShares::grantForADay(TestActors::record('binders.binder', 1), $configuration);
    }
}
