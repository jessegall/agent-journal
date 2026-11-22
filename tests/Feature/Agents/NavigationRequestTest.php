<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Enums\NavigationCompletion;
use App\Agents\Enums\NavigationState;
use App\Agents\Exceptions\NavigationTransitionRefused;
use App\Agents\Models\NavigationRequest;
use Illuminate\Database\UniqueConstraintViolationException;
use Tests\Support\Agents\RaisesNavigationRequests;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\TestCase;

/**
 * A navigation request follows the state table of doc 54, section 5: raised once per host raise, one open per
 * runtime, moved only where the table allows, and read only by the user who owns it.
 */
final class NavigationRequestTest extends TestCase
{
    use CommitsHookRows;
    use RaisesNavigationRequests;
    use RunsTrustedCommands;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'start_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'navigation_requests',
        'accounts',
        'active_accounts',
        'process_starts',
    ];

    public function test_a_raised_request_carries_its_script_goal_runtime_and_screen(): void
    {
        $stalled = $this->stalledScript();

        $navigation = $this->raise($stalled, 'raise-1');

        $this->assertSame(NavigationState::Open, $navigation->state);
        $this->assertSame([$stalled->id, $stalled->agent_runtime_id], [
            $navigation->driver_request_id,
            $navigation->agent_runtime_id,
        ]);
        $this->assertSame(['claude-code', '2.1.323'], [$navigation->driver_key, $navigation->build]);
        $this->assertEquals($stalled->scriptGoal(), $navigation->goal());
        $this->assertSame(['Model: GPT-5', '❯ GPT-6'], $navigation->fresh()?->screen->rows);
        $this->assertSame(['Model: GPT-5', '❯ GPT-6'], $navigation->raise_rows);
        $this->assertSame(1, $navigation->row_version);
    }

    public function test_a_request_goes_through_rounds_a_refused_proof_and_a_seen_one(): void
    {
        $navigation = $this->raise($this->stalledScript(), 'raise-1');

        $navigation->answer();
        $navigation->answer();
        $navigation->prove(NavigationCompletion::Step, 3, 'GPT-6');
        $navigation->refuseProof();
        $this->assertSame([NavigationState::Answering, null], [$navigation->state, $navigation->proof]);
        $navigation->prove(NavigationCompletion::Goal, null, 'Set model to GPT-6');
        $navigation->markProven();

        $proven = NavigationRequest::query()->findOrFail($navigation->id);
        $this->assertSame([NavigationState::Proven, NavigationCompletion::Goal], [$proven->state, $proven->completes]);
        $this->assertSame(['Set model to GPT-6', 7], [$proven->proof, $proven->row_version]);
    }

    public function test_every_other_end_of_the_table_is_reached_from_its_state(): void
    {
        $stalled = $this->stalledScript();
        $ends = [
            'cancel while open' => fn (NavigationRequest $navigation) => $navigation->cancel(),
            'expire while open' => fn (NavigationRequest $navigation) => $navigation->expire(),
            'abandon' => fn (NavigationRequest $navigation) => [$navigation->answer(), $navigation->abandon('stuck')],
            'interrupt' => fn (NavigationRequest $navigation) => [$navigation->answer(), $navigation->interrupt()],
            'cancel while answering' => fn (NavigationRequest $navigation) => [
                $navigation->answer(),
                $navigation->cancel(),
            ],
            'expire while answering' => fn (NavigationRequest $navigation) => [
                $navigation->answer(),
                $navigation->expire(),
            ],
        ];

        foreach ($ends as $name => $end) {
            $navigation = $this->raise($stalled, $name);
            $end($navigation);

            $this->assertFalse($navigation->fresh()?->state->isOpen(), $name);
        }
    }

    public function test_a_move_the_table_does_not_allow_is_refused_by_name(): void
    {
        $navigation = $this->raise($this->stalledScript(), 'raise-1');
        $refused = [
            'prove while open' => fn () => $navigation->prove(NavigationCompletion::Goal, null, 'GPT-6'),
            'prove proven while open' => fn () => $navigation->markProven(),
            'expire while proving' => fn () => [
                $navigation->answer(),
                $navigation->prove(NavigationCompletion::Goal, null, 'GPT-6'),
                $navigation->expire(),
            ],
            'answer after the end' => fn () => [$navigation->markProven(), $navigation->answer()],
        ];

        foreach ($refused as $name => $move) {
            try {
                $move();
                $this->fail("{$name} was allowed.");
            } catch (NavigationTransitionRefused) {
                $this->addToAssertionCount(1);
            }
        }

        $this->assertSame(NavigationState::Proven, $navigation->fresh()?->state);
    }

    public function test_the_same_raise_is_one_row_and_a_second_open_request_is_refused_by_the_database(): void
    {
        $stalled = $this->stalledScript();
        $first = $this->raise($stalled, 'raise-1');

        $this->assertSame($first->id, $this->raise($stalled, 'raise-1')->id);

        $this->expectException(UniqueConstraintViolationException::class);
        $this->raise($stalled, 'raise-2');
    }

    public function test_another_users_actor_never_reads_the_request(): void
    {
        $navigation = $this->raise($this->stalledScript(), 'raise-1');
        $setter = $this->app->make(CurrentActorSetter::class);

        $setter->set(ActorContext::forUser('someone-else'), new OwnerAuthority('test'));
        $this->assertNull(NavigationRequest::query()->find($navigation->id));

        $setter->set(ActorContext::forUser('owner'), new OwnerAuthority('test'));
        $this->assertSame($navigation->id, NavigationRequest::query()->open()->firstOrFail()->id);
    }
}
