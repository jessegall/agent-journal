<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Contracts\Event;
use App\Hooks\Declarations\StateMethods;
use App\Hooks\States\AgentState;
use App\Reflection\Support\Reflector;
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
        if (! $parameter->type instanceof Name || ! is_subclass_of($parameter->type->toString(), Event::class)) {
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

        if (! is_subclass_of($name, AgentState::class) && ! trait_exists($name)) {
            return false;
        }

        $declared = Reflector::of($name)->method($method->name->toString());

        return new StateMethods()->eventFor($declared) === $parameter->type->toString();
    }
}
