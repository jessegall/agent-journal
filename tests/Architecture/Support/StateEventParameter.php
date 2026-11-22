<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Contracts\Event;
use App\Declarations\StateMethods;
use App\Support\Reflector;
use App\Support\States\AgentState;
use PhpParser\Node\Name;
use PhpParser\Node\Param;
use PhpParser\Node\Stmt\ClassLike;
use PhpParser\Node\Stmt\ClassMethod;

/**
 * Identifies a state event parameter from its resolved source name and effective signature.
 */
final class StateEventParameter
{
    public static function matches(Param $parameter): bool
    {
        if (! $parameter->type instanceof Name
            || ! Reflector::factory()->isSubclassOf($parameter->type->toString(), Event::class)) {
            return false;
        }

        $method = $parameter->getAttribute('parent');

        if (! $method instanceof ClassMethod || $method->params[0] !== $parameter) {
            return false;
        }

        $class = $method->getAttribute('parent');

        if (! $class instanceof ClassLike || ! isset($class->namespacedName)) {
            return false;
        }

        $name = $class->namespacedName->toString();

        $declared = Reflector::exists($name) ? Reflector::of($name) : null;

        if ($declared === null || (! $declared->isSubclassOf(AgentState::class) && ! $declared->isTrait())) {
            return false;
        }

        $event = new StateMethods()->eventFor($declared->method($method->name->toString()));

        return $event === $parameter->type->toString();
    }
}
