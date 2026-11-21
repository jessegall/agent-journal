<?php

declare(strict_types=1);

namespace Tests\Unit\Hooks\States;

use App\Hooks\Decisions\Decision;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Inputs\Contracts\HookInput;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\States\AgentState;
use App\Hooks\States\ReadyState;
use App\Reflection\Support\DeclaredType;
use App\Reflection\Support\ReflectedMethod;
use App\Reflection\Support\Reflector;
use PHPUnit\Framework\Attributes\DataProviderExternal;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Hooks\AllowedStops;
use Tests\Fixtures\Hooks\FixedOperationPolicy;
use Tests\Fixtures\Hooks\HookInputs;

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
                return Decision::allow();
            }
        };

        $this->assertNotContains('onStop', $this->hooksNotAnsweredBy($partial::class));
        $this->assertContains('onSessionStart', $this->hooksNotAnsweredBy($partial::class));
    }

    #[DataProviderExternal(HookInputs::class, 'dataSets')]
    public function test_ready_allows_each_hook(HookInput $input): void
    {
        $this->assertSame(
            AnswerType::Allow,
            $input->answerBy(new ReadyState(new FixedOperationPolicy(), new AllowedStops()))->answerType(),
        );
    }

    #[DataProviderExternal(HookInputs::class, 'dataSets')]
    public function test_the_base_state_delegates_each_hook(HookInput $input): void
    {
        $this->assertSame(AnswerType::Delegate, $input->answerBy(new class extends AgentState {})->answerType());
    }

    public function test_a_state_is_not_finished_unless_it_says_so(): void
    {
        $this->assertFalse(new ReadyState(new FixedOperationPolicy(), new AllowedStops())->isFinished());
    }

    /**
     * The public hook methods of the base state, read by reflection, that the class does not declare itself.
     *
     * @param  class-string<AgentState>  $class
     * @return list<string>
     */
    private function hooksNotAnsweredBy(string $class): array
    {
        $hooks = array_filter(
            Reflector::of(AgentState::class)->methods(),
            fn (ReflectedMethod $method) => $method->isPublic()
                && str_starts_with($method->name(), 'on')
                && $method->returnType()->filter(fn (DeclaredType $type) => $type->text === Decision::class)->isDefined(),
        );
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
