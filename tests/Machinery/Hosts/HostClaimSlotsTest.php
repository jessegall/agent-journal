<?php

declare(strict_types=1);

namespace Tests\Machinery\Hosts;

use App\Hosts\HostClaimSlots;
use App\Http\Controllers\Hosts\ClaimOrdersController;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\TestCase;

/**
 * One long poll per host waits at a time: the host's newest claim holds the slot, and Redis waits longer than the
 * longest poll.
 */
#[TestsMachinery(HostClaimSlots::class)]
final class HostClaimSlotsTest extends TestCase
{
    public function test_the_hosts_newest_claim_holds_the_slot_and_the_one_it_deposed_gives_nothing_back(): void
    {
        $slots = $this->journal->service(HostClaimSlots::class);
        $host = (string) Str::ulid();

        $free = $slots->isTaken($host);
        $left = $slots->take($host);
        $newest = $slots->take($host);
        $held = [$slots->isHeldBy($host, $left), $slots->isHeldBy($host, $newest)];
        $slots->release($host, $left);
        $stillTaken = $slots->isTaken($host);
        $slots->release($host, $newest);

        $this->journal->assertResult(
            [false, [false, true], true, false, true],
            [
                $free,
                $held,
                $stillTaken,
                $slots->isTaken($host),
                (int) config('database.redis.default.read_timeout') > ClaimOrdersController::WAIT_LIMIT_SECONDS,
            ],
        );
    }
}
