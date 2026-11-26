<?php

declare(strict_types=1);

namespace Tests\Machinery\Hooks;

use App\Enums\Engine\NoSubject;
use App\Support\AgentStacks;
use App\Support\References\StateReference;
use Tests\Support\CommittedHookStack;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\TestIds;
use Tests\TestCase;

#[TestsMachinery(AgentStacks::class)]
final class StackInspectionTest extends TestCase
{
    use CommittedHookStack;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->pushState($this->target, $this->task(42));
        $this->journal->pushState($this->target, new StateReference('guide', NoSubject::None));
    }

    public function test_a_user_sees_the_frames_bottom_first_and_the_last_walk_as_it_ran(): void
    {
        $this->answerStop();
        $stdout = $this->answerStop();

        $inspection = $this->actingAs($this->journal->owner()->ownerUser())->getJson(
            '/hooks/stacks/'.TestIds::of(1).'/'.TestIds::of(10),
        )->assertOk()->json();

        $this->assertSame(
            [TestIds::of(1), TestIds::of(10), 'active'],
            [$inspection['agentId'], $inspection['sessionId'], $inspection['status']],
        );
        $this->assertSame(['core.ready', 'test.tasks', 'guide'], array_column($inspection['frames'], 'typeKey'));
        $this->assertSame(
            [null, ['id' => '42', 'runNumber' => 1], null],
            array_column($inspection['frames'], 'subject'),
        );
        $this->assertSame([true, false, false], array_column($inspection['frames'], 'isBottom'));
        $this->assertSame('hook-call-2', $inspection['lastCall']['hookId']);
        $this->assertSame('deny', $inspection['lastCall']['answer']);
        $this->assertSame($stdout, $inspection['lastCall']['stdout']);
    }

    public function test_the_walk_shows_only_the_states_it_asked(): void
    {
        $this->answerStop();

        $steps = $this->actingAs($this->journal->owner()->ownerUser())->getJson(
            '/hooks/stacks/'.TestIds::of(1).'/'.TestIds::of(10),
        )->json('lastCall.steps');

        $this->assertSame([['guide', 'delegate'], ['test.tasks', 'deny']], array_map(
            fn (array $step) => [$step['stateType'], $step['answer']],
            $steps,
        ));
    }

    public function test_a_stack_without_answered_calls_shows_no_last_call(): void
    {
        $inspection = $this->actingAs($this->journal->owner()->ownerUser())->getJson(
            '/hooks/stacks/'.TestIds::of(1).'/'.TestIds::of(10),
        )->assertOk()->json();

        $this->assertArrayNotHasKey('lastCall', $inspection);
    }

    public function test_a_stack_that_does_not_exist_is_not_found(): void
    {
        $this->actingAs($this->journal->owner()->ownerUser())->getJson('/hooks/stacks/1/99')->assertNotFound();
    }
}
