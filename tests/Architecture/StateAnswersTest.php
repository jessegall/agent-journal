<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Contracts\Bus\Command;
use App\Contracts\Events\Event;
use App\Support\Decisions\Contracts\AnswerPart;
use App\Support\DeclaredType;
use App\Support\Inputs\Contracts\HookAnswerer;
use App\Support\References\StateReference;
use App\Support\ReflectedMethod;
use App\Support\Reflector;
use App\Support\States\AgentState;
use Tests\TestCase;
use Traversable;

/**
 * A state's hook method always answers, and only with what a state may answer: an answer part (a decision or a line),
 * a command, an event, or several of those to yield. Never null and never mixed: a state that has nothing to say
 * answers Decision::delegate(). The contract declares it, so PHP refuses a state
 * that widens it; this test holds the contract itself.
 */
final class StateAnswersTest extends TestCase
{
    /** What a hook method may answer, as PHP names the parts of the declared type: iterable is Traversable or array. */
    private const array ANSWERS = [
        Command::class,
        Event::class,
        AnswerPart::class,
        StateReference::class,
        Traversable::class,
        'array',
    ];

    public function test_every_hook_method_of_the_contract_and_of_the_base_state_declares_exactly_what_a_state_may_answer(): void
    {
        $expected = self::ANSWERS;
        sort($expected);

        foreach ([HookAnswerer::class, AgentState::class] as $type) {
            foreach (self::hookMethodNames() as $name) {
                $this->assertSame($expected, self::answerTypesOf($type, $name), "{$type}::{$name}");
            }
        }
    }

    public function test_no_state_names_null_in_what_a_hook_method_answers(): void
    {
        $nullable = [];

        foreach (self::states() as $state) {
            foreach (self::hookMethodNames() as $name) {
                $declared = $state->method($name)->returnType();

                if ($declared->isEmpty() || $declared->get()->allowsNull) {
                    $nullable[] = "{$state->name()}::{$name}";
                }
            }
        }

        $this->assertSame([], $nullable);
    }

    /**
     * @return list<string>
     */
    private static function hookMethodNames(): array
    {
        return array_map(
            fn (ReflectedMethod $method) => $method->name(),
            Reflector::of(HookAnswerer::class)->methods(),
        );
    }

    /**
     * The names of the types the method is declared to answer, in order of name.
     *
     * @param  class-string  $type
     * @return list<string>
     */
    private static function answerTypesOf(string $type, string $method): array
    {
        $declared = Reflector::of($type)->method($method)->returnType()->get();
        $names = array_map(fn (DeclaredType $member) => $member->name(), $declared->members);
        sort($names);

        return $names;
    }

    /**
     * Every state of the journal and of its domains.
     *
     * @return list<Reflector<object>>
     */
    private static function states(): array
    {
        $files = [
            ...glob(app_path('Support/States/*.php')) ?: [],
            ...glob(base_path('domain/*/src/Support/States/*.php')) ?: [],
        ];
        $states = [];

        foreach ($files as $file) {
            $relative = substr($file, strlen(base_path()) + 1, -4);
            $class = str_starts_with($relative, 'app/')
                ? 'App\\'.str_replace('/', '\\', substr($relative, 4))
                : 'Domain\\'.str_replace('/', '\\', (string) preg_replace('#^domain/([^/]+)/src/#', '$1/', $relative));

            $state = Reflector::find($class)->filter(fn (Reflector $found) => $found->isSubclassOf(AgentState::class));

            if ($state->isDefined()) {
                $states[] = $state->get();
            }
        }

        return $states;
    }
}
