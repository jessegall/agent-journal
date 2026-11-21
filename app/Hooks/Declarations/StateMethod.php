<?php

declare(strict_types=1);

namespace App\Hooks\Declarations;

use App\Hooks\Attributes\StackWide;
use App\Hooks\States\AgentState;
use App\Reflection\Support\ReflectedMethod;

/**
 * An effective method and its selection marker on a registered state class.
 */
final readonly class StateMethod
{
    /**
     * @param  class-string<AgentState>  $stateClass
     * @param  class-string  $declaringClass
     */
    private function __construct(
        public string $stateClass,
        public string $declaringClass,
        public string $name,
        public bool $stackWide,
    ) {}

    /**
     * @param  class-string<AgentState>  $class
     */
    public static function fromMethod(string $class, ReflectedMethod $method): self
    {
        return new self(
            $class,
            $method->declaringClass()->name(),
            $method->name(),
            $method->hasAttribute(StackWide::class),
        );
    }
}
