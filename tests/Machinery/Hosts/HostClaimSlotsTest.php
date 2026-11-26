<?php

declare(strict_types=1);

namespace Tests\Machinery\Hosts;

use App\Http\Controllers\Hosts\ClaimOrdersController;
use App\Support\Hosts\HostClaimSlots;
use Illuminate\Support\Str;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\TestCase;

/**
 * One long poll per host waits at a time, and Redis waits longer than the longest poll.
 */
#[TestsMachinery(HostClaimSlots::class)]
final class HostClaimSlotsTest extends TestCase
{
    public function test_a_second_claim_of_one_host_is_refused_until_the_first_gives_its_slot_back(): void
    {
        $slots = $this->journal->service(HostClaimSlots::class);
        $host = (string) Str::ulid();

        $first = $slots->take($host);
        $second = $slots->take($host);
        $slots->release($host);

        $this->journal->assertResult(
            [true, false, true, true],
            [
                $first,
                $second,
                $slots->take($host),
                (int) config('database.redis.default.read_timeout') > ClaimOrdersController::WAIT_LIMIT_SECONDS,
            ],
        );
    }
}
