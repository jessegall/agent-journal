<?php

declare(strict_types=1);

namespace Tests\Unit\Communication;

use App\Exceptions\MembershipEvidenceMismatch;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentReference;
use App\Support\InboxMembership;
use PHPUnit\Framework\TestCase;
use Tests\Support\TestActors;
use Tests\Support\TestIds;

/**
 * A membership answers with the evidence it holds and refuses the other kind by name.
 */
final class InboxMembershipTest extends TestCase
{
    public function test_a_desk_membership_gives_its_seat_and_refuses_an_interval(): void
    {
        $actor = TestActors::agentIdentity(1);
        $seat = new AssignmentReference(TestIds::of(2), AssigneeIdentity::ofActorIdentity($actor));
        $membership = InboxMembership::atDeskSeat($actor, $seat);

        $this->assertSame($seat, $membership->deskSeat());
        $this->assertFalse($membership->isChat());

        $this->expectException(MembershipEvidenceMismatch::class);
        $membership->interval();
    }

    public function test_a_chat_membership_gives_its_interval_and_refuses_a_seat(): void
    {
        $membership = InboxMembership::inInterval(TestActors::agentIdentity(1), TestIds::of(3));

        $this->assertSame(TestIds::of(3), $membership->interval());
        $this->assertTrue($membership->isChat());

        $this->expectException(MembershipEvidenceMismatch::class);
        $membership->deskSeat();
    }
}
