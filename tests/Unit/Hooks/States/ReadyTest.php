<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks\States;

use App\Support\Decisions\Decision;
use App\Support\Inputs\Contracts\HookAnswerer;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Inputs\StopRequested;
use App\Support\ReflectedMethod;
use App\Support\Reflector;
use App\Support\States\AgentState;
use App\Support\States\ReadyState;
use PHPUnit\Framework\Attributes\DataProviderExternal;
use Tests\Fixtures\Hooks\AllowedStops;
use Tests\Fixtures\Hooks\FixedOperationPolicy;
use Tests\Fixtures\Hooks\HookInputs;
use Tests\TestCase;

final class ReadyTest extends TestCase
{
    public function test_ready_answers_every_hook_method_of_the_base_state_itself(): void
    {
        $this->assertSame([], $this->hooksNotAnsweredBy(ReadyState::class));
    }

    public function test_a_state_that_skips_a_hook_is_caught_by_the_same_check(): void
    {
        $partial = new class extends AgentState
        {
            public function onStop(StopRequested $input): Decision
            {
                return Decision::delegate();
            }
        };

        $this->assertNotContains('onStop', $this->hooksNotAnsweredBy($partial::class));
        $this->assertContains('onSessionStart', $this->hooksNotAnsweredBy($partial::class));
    }

    #[DataProviderExternal(HookInputs::class, 'dataSets')]
    public function test_ready_passes_each_hook_its_policy_grants(HookInput $input): void
    {
        $answer = $input->answerBy(new ReadyState(new FixedOperationPolicy(), new AllowedStops()));

        $this->assertEquals(Decision::delegate(), $answer);
    }

    #[DataProviderExternal(HookInputs::class, 'dataSets')]
    public function test_the_base_state_passes_each_hook(HookInput $input): void
    {
        $this->assertEquals(Decision::delegate(), $input->answerBy(new class extends AgentState {}));
    }

    public function test_a_state_is_not_finished_unless_it_says_so(): void
    {
        $this->assertFalse(new ReadyState(new FixedOperationPolicy(), new AllowedStops())->isFinished());
    }

    /**
     * The hook methods every state answers, read by reflection, that the class does not declare itself.
     *
     * @param  class-string<AgentState>  $class
     * @return list<string>
     */
    private function hooksNotAnsweredBy(string $class): array
    {
        $hooks = Reflector::of(HookAnswerer::class)->methods();
        $state = Reflector::of($class);

        return array_values(array_map(
            fn (ReflectedMethod $method) => $method->name(),
            array_filter(
                $hooks,
                fn (ReflectedMethod $method) => $state->method($method->name())->declaringClass()->name() !== $class,
            ),
        ));
    }
}
