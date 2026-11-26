<?php

declare(strict_types=1);

namespace App\Stacks\Declarations;

use App\Stacks\AgentState;
use App\Support\ReflectedMethod;

/**
 * An effective method on a registered state class.
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
        );
    }
}
