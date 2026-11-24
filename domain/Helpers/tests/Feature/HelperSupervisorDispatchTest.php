<?php

declare(strict_types=1);

namespace Domain\Helpers\Tests\Feature;

use App\Contracts\Processes\SupervisorDispatch;
use App\Enums\SupervisorDispatchOutcome;
use App\Support\ActorIdentity;
use App\Support\UnavailableSupervisorDispatch;
use App\Values\SupervisorRequest;
use Domain\Access\Support\AccessSettings;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Tests\Support\DispatchesHelpers;
use Domain\Helpers\Tests\TestCase;
use Illuminate\Support\Str;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * An ask routed to a supervisor profile with no running helper starts it: two asks to the single reviewer
 * keep one owner-held helper, with no owner configured nothing starts, and without Helpers every start is unavailable.
 */
#[TimeLimit(seconds: 8, reason: 'It activates profiles and starts helper sessions for asks.')]
final class HelperSupervisorDispatchTest extends TestCase
{
    use DispatchesHelpers;
    use RefreshHookDatabase;

    public function test_two_asks_to_the_single_reviewer_keep_one_owner_held_helper(): void
    {
        $dispatch = $this->app->make(SupervisorDispatch::class);

        $first = $dispatch->startFor($this->request('Review plan 7'));
        $second = $dispatch->startFor($this->request('Review plan 8'));

        $this->assertSame([SupervisorDispatchOutcome::Started, SupervisorDispatchOutcome::Started], [$first, $second]);
        $identity = HelperIdentity::designatedFor('lone-reviewer')->get();
        $this->assertSame(1, HelperIdentity::query()->acrossActors()->where('profile_key', 'lone-reviewer')->count());
        $this->assertSame('user', $identity->actor_type);
    }

    public function test_with_no_owner_configured_nothing_starts(): void
    {
        $this->app->instance(AccessSettings::class, new AccessSettings(null));

        $outcome = $this->app->make(SupervisorDispatch::class)->startFor($this->request('Review plan 7'));

        $this->assertSame(SupervisorDispatchOutcome::Unavailable, $outcome);
        $this->assertTrue(HelperIdentity::designatedFor('lone-reviewer')->isEmpty());
    }

    public function test_without_helpers_every_start_is_unavailable(): void
    {
        $outcome = new UnavailableSupervisorDispatch()->startFor($this->request('Review plan 7'));

        $this->assertSame(SupervisorDispatchOutcome::Unavailable, $outcome);
    }

    private function request(string $body): SupervisorRequest
    {
        $asker = ActorIdentity::of($this->parent->agent);

        return new SupervisorRequest('lone-reviewer', (string) Str::ulid(), $body, $asker);
    }
}
