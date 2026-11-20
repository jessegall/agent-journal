<?php

declare(strict_types=1);

namespace App\Hooks\Declarations;

use App\Hooks\Attributes\StackWide;
use App\Hooks\States\AgentState;
use ReflectionMethod;

/**
 * An effective method and its selection marker on a registered state class.
 */
final readonly class StateMethod
{
    /**
     * @param class-string<AgentState> $stateClass
     * @param class-string $declaringClass
     */
    private function __construct(
        public string $stateClass,
        public string $declaringClass,
        public string $name,
        public bool $stackWide,
    ) {}

    /**
     * @param class-string<AgentState> $stateClass
     */
    public static function fromMethod(string $stateClass, ReflectionMethod $method): self
    {
        return new self(
            $stateClass,
            $method->getDeclaringClass()->getName(),
            $method->getName(),
            $method->getAttributes(StackWide::class) !== [],
        );
    }
}
