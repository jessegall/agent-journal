<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Actors\Contracts\ActorAttention;
use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Contracts\MainSeatTakeover;
use App\Agents\Enums\HoldReason;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\DriverRequest;
use App\Agents\Models\NavigationRequest;
use App\Agents\Support\EnrolledHost;
use App\Agents\Support\OpenedRuntime;
use App\Assignments\Contracts\AssignmentTransaction;
use Domain\Access\Support\AccessSettings;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\RecordedAttention;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsDesks;
use Tests\Support\RunsTrustedCommands;
use Tests\TestCase;

/**
 * The host's one call at an uncertain point: it opens one navigation request, holds the runtime and wakes the main
 * desk's occupant; a repeated raise answers the same; a runtime raising the same menu waits; the main agent's own
 * runtime stays held for the person; another host is refused.
 */
final class NavigationRaiseRouteTest extends TestCase
{
    use CommitsHookRows;
    use InstallsDesks;
    use OpensLedgerRuntimes;
    use RunsTrustedCommands;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'launch_credentials',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'navigation_requests',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
    ];

    private RecordedAttention $attention;

    protected function setUp(): void
    {
        parent::setUp();
        $this->app->instance(AccessSettings::class, new AccessSettings('owner'));
        $this->attention = new RecordedAttention();
        $this->app->bind(ActorAttention::class, fn () => $this->attention);
    }

    public function test_a_raise_opens_one_request_holds_the_runtime_and_wakes_once_when_sent_twice(): void
    {
        $this->seat(Agent::named('Main', 'main-agent'));
        [$host, $opened, $request] = $this->stalledScript();

        $first = $this->raise($host, $opened, $request)->assertOk();
        $second = $this->raise($host, $opened, $request)->assertOk();

        $this->assertSame('opened', $first->json('answer'));
        $this->assertSame($first->json('requestId'), $second->json('requestId'));
        $this->assertSame(1, NavigationRequest::query()->acrossActors()->count());
        $navigation = NavigationRequest::query()->acrossActors()->sole();
        $this->assertSame(['Model: GPT-5', '❯ GPT-6'], $navigation->raise_rows);
        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);
        $this->assertSame(HoldReason::NavigationNeeded, $runtime->hold_reason);
        $this->assertSame(2, $request->fresh()?->script_step);
        $this->assertCount(1, $this->attention->wakes);
    }

    public function test_a_second_runtime_raising_the_same_menu_waits_and_opens_nothing(): void
    {
        $this->seat(Agent::named('Main', 'main-agent'));
        [$host, $opened, $request] = $this->stalledScript();
        [$otherHost, $other, $otherRequest] = $this->stalledScript();
        $this->raise($host, $opened, $request)->assertOk();

        $waiting = $this->raise($otherHost, $other, $otherRequest)->assertOk();

        $this->assertSame(['wait', 30], [$waiting->json('answer'), $waiting->json('retryAfterSeconds')]);
        $this->assertSame(1, NavigationRequest::query()->acrossActors()->count());
    }

    public function test_the_main_agents_own_runtime_is_held_for_the_person(): void
    {
        [$host, $opened, $request] = $this->stalledScript();
        $this->seat(Agent::query()->findOrFail($this->agentIdOf($opened)));

        $held = $this->raise($host, $opened, $request)->assertOk();

        $this->assertSame('held', $held->json('answer'));
        $this->assertSame(0, NavigationRequest::query()->acrossActors()->count());
    }

    public function test_a_raise_for_another_hosts_runtime_or_with_an_oversized_screen_is_refused(): void
    {
        $this->seat(Agent::named('Main', 'main-agent'));
        [$host, $opened, $request] = $this->stalledScript();
        [$otherHost] = $this->stalledScript();

        $this->assertGreaterThanOrEqual(400, $this->raise($otherHost, $opened, $request)->status());
        $tooLong = $this->raise($host, $opened, $request, array_fill(0, 61, 'row'));
        $this->assertGreaterThanOrEqual(400, $tooLong->status());
        $this->assertSame(0, NavigationRequest::query()->acrossActors()->count());
    }

    /**
     * A ChangeModel key script on a newly opened runtime of its own host, as the host claimed it.
     *
     * @return array{EnrolledHost, OpenedRuntime, DriverRequest}
     */
    private function stalledScript(): array
    {
        [$host, $opened] = $this->openRuntime();
        $receipt = $this->asOwner($this->keyScript($opened, 'ChangeModel', ['model' => 'GPT-6']));

        return [$host, $opened, DriverRequest::query()->findOrFail($receipt->requestId)];
    }

    /**
     * The host's raise of the request stalled at its step 2 on the model picker.
     *
     * @param  list<string>  $rows
     */
    private function raise(
        EnrolledHost $host,
        OpenedRuntime $opened,
        DriverRequest $request,
        array $rows = ['Model: GPT-5', '❯ GPT-6'],
    ): TestResponse {
        return $this->hostCall($host, "/host/runtimes/{$opened->runtimeId}/navigation", [
            'operation_key' => "{$request->id}:{$request->attempt_version}:2",
            'request_id' => $request->id,
            'attempt' => $request->attempt_version,
            'step' => 2,
            'reason' => 'label-missing',
            'fingerprint' => 'fp1:'.str_repeat('a', 64),
            'rows' => $rows,
            'highlight' => 1,
            'generation' => 7,
        ]);
    }

    private function seat(Agent $agent): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(MainSeatTakeover::class)->takeOver($agent),
        );
    }
}
