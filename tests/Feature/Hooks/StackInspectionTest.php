<?php

declare(strict_types=1);

namespace Tests\Feature\Hooks;

use App\Hooks\Decisions\StateReference;
use App\Hooks\Enums\NoSubject;
use Domain\Access\Models\User;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Support\CommittedHookStack;
use Tests\Support\TestIds;
use Tests\TestCase;

final class StackInspectionTest extends TestCase
{
    use CommittedHookStack;

    protected function setUp(): void
    {
        parent::setUp();

        $this->pushState($this->task(42));
        $this->pushState(new StateReference('guide', NoSubject::None));
    }

    public function test_a_user_sees_the_frames_bottom_first_and_the_last_walk_as_it_ran(): void
    {
        $this->answerStop('call-1');
        $stdout = $this->answerStop('call-2');

        $inspection = $this->actingAs(User::factory()->create())->getJson(
            '/hooks/stacks/'.TestIds::of(1).'/'.TestIds::of(10),
        )->assertOk()->json();

        $this->assertSame(
            [TestIds::of(1), TestIds::of(10), 'active'],
            [$inspection['agentId'], $inspection['sessionId'], $inspection['status']],
        );
        $this->assertSame(['hooks.ready', 'test.tasks', 'guide'], array_column($inspection['frames'], 'typeKey'));
        $this->assertSame(
            [null, ['id' => '42', 'runNumber' => 1], null],
            array_column($inspection['frames'], 'subject'),
        );
        $this->assertSame([true, false, false], array_column($inspection['frames'], 'isBottom'));
        $this->assertSame('call-2', $inspection['lastCall']['hookId']);
        $this->assertSame('deny', $inspection['lastCall']['answer']);
        $this->assertSame($stdout, $inspection['lastCall']['stdout']);
    }

    public function test_the_walk_shows_only_the_states_it_asked(): void
    {
        $this->answerStop('call-1');

        $steps = $this->actingAs(User::factory()->create())->getJson(
            '/hooks/stacks/'.TestIds::of(1).'/'.TestIds::of(10),
        )->json('lastCall.steps');

        $this->assertSame([['guide', 'delegate', 'keep'], ['test.tasks', 'deny', 'keep']], array_map(
            fn (array $step) => [$step['stateType'], $step['answer'], $step['change']],
            $steps,
        ));
    }

    public function test_a_stack_without_answered_calls_shows_no_last_call(): void
    {
        $inspection = $this->actingAs(User::factory()->create())->getJson(
            '/hooks/stacks/'.TestIds::of(1).'/'.TestIds::of(10),
        )->assertOk()->json();

        $this->assertArrayNotHasKey('lastCall', $inspection);
    }

    public function test_a_stack_that_does_not_exist_is_not_found(): void
    {
        $this->actingAs(User::factory()->create())->getJson('/hooks/stacks/1/99')->assertNotFound();
    }

    public function test_a_guest_cannot_read_a_stack(): void
    {
        $this->getJson('/hooks/stacks/'.TestIds::of(1).'/'.TestIds::of(10))->assertUnauthorized();
    }

    public function test_an_agent_with_its_own_credential_cannot_read_a_stack(): void
    {
        $agent = TestLaunch::start();

        $this->call(
            'GET',
            '/hooks/stacks/'.TestIds::of(1).'/'.TestIds::of(10),
            server: $agent->serverHeaders(
                '',
                method: 'GET',
                target: '/hooks/stacks/'.TestIds::of(1).'/'.TestIds::of(10),
            ),
        )->assertUnauthorized();
    }
}
