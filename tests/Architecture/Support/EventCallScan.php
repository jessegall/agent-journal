<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node;
use PhpParser\Node\Arg;
use PhpParser\Node\Expr;
use PhpParser\Node\Identifier;
use PhpParser\Node\Name;
use PhpParser\Node\Scalar\String_;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\NodeFinder;
use PhpParser\PrettyPrinter\Standard;

/**
 * Every call of a file that raises or hears an event, with the type of event it passes.
 */
final class EventCallScan
{
    private const array EVENT_FACADES = ['Illuminate\\Support\\Facades\\Event', 'Event'];

    /**
     * Each call that raises or hears an event, and whether it raises.
     */
    private const array FACADE_METHODS = ['listen' => false, 'subscribe' => false, 'dispatch' => true, 'until' => true];

    private const array HELPERS = ['event', 'broadcast'];

    private const array RECEIVER_METHODS = ['listen' => false, 'dispatch' => true, 'until' => true];

    /**
     * @return list<EventCall>
     */
    public static function of(ParsedFile $file): array
    {
        $calls = [];
        $finder = new NodeFinder;

        foreach ($finder->findInstanceOf($file->statements, Expr\FuncCall::class) as $call) {
            if (! $call->name instanceof Name || ! in_array($call->name->toLowerString(), self::HELPERS, true)) {
                continue;
            }

            $calls[] = self::eventCall($file, $call, $call->name->toString().'()', raises: true, takesOnlyEvents: true);
        }

        foreach ($finder->findInstanceOf($file->statements, Expr\StaticCall::class) as $call) {
            if (! self::isEventFacadeCall($call) || ! $call->name instanceof Identifier) {
                continue;
            }

            $method = $call->name->toString();
            $calls[] = self::eventCall($file, $call, "Event::{$method}()", self::FACADE_METHODS[$method], takesOnlyEvents: true);
        }

        foreach ($finder->findInstanceOf($file->statements, Expr\MethodCall::class) as $call) {
            if (! $call->name instanceof Identifier || ! isset(self::RECEIVER_METHODS[$call->name->toString()])) {
                continue;
            }

            $method = $call->name->toString();
            $calls[] = self::eventCall($file, $call, "->{$method}()", self::RECEIVER_METHODS[$method], takesOnlyEvents: $method === 'listen');
        }

        return $calls;
    }

    private static function isEventFacadeCall(Expr\StaticCall $call): bool
    {
        return $call->class instanceof Name
            && in_array($call->class->toString(), self::EVENT_FACADES, true)
            && $call->name instanceof Identifier
            && isset(self::FACADE_METHODS[$call->name->toString()]);
    }

    private static function eventCall(ParsedFile $file, Expr\CallLike $call, string $label, bool $raises, bool $takesOnlyEvents): EventCall
    {
        $first = $call->getArgs()[0] ?? null;
        $event = $first instanceof Arg ? $first->value : null;

        return new EventCall(
            $file->path,
            $call->getStartLine(),
            $label,
            $raises,
            $takesOnlyEvents,
            self::argumentType($event, $call),
            self::eventText($event),
        );
    }

    private static function argumentType(Expr|null $event, Node $call): EventArgument
    {
        return match (true) {
            $event instanceof String_ => EventArgument::String,
            $event instanceof Expr\Array_ && self::holdsOnlyStrings($event) => EventArgument::StringList,
            $event instanceof Expr\ClassConstFetch && $event->class instanceof Name && $event->name instanceof Identifier && $event->name->toLowerString() === 'class' => EventArgument::ClassName,
            $event instanceof Expr\Variable && $event->name === self::listenerParameter($call) => EventArgument::ListenerParameter,
            default => EventArgument::Other,
        };
    }

    private static function holdsOnlyStrings(Expr\Array_ $array): bool
    {
        foreach ($array->items as $item) {
            if (! $item->value instanceof String_) {
                return false;
            }
        }

        return $array->items !== [];
    }

    /**
     * The name of the typed event parameter of the handle method the call stands in, if it stands in one.
     */
    private static function listenerParameter(Node $node): string|null
    {
        $method = $node->getAttribute('parent');

        while ($method instanceof Node && ! $method instanceof ClassMethod) {
            $method = $method->getAttribute('parent');
        }

        if (! $method instanceof ClassMethod || $method->name->toLowerString() !== 'handle') {
            return null;
        }

        $parameter = $method->params[0] ?? null;

        if ($parameter === null || ! $parameter->type instanceof Name || ! $parameter->var instanceof Expr\Variable) {
            return null;
        }

        return is_string($parameter->var->name) ? $parameter->var->name : null;
    }

    private static function eventText(Expr|null $event): string
    {
        return match (true) {
            $event === null => '',
            $event instanceof String_ => $event->value,
            $event instanceof Expr\ClassConstFetch && $event->class instanceof Name => $event->class->toString(),
            default => (new Standard)->prettyPrintExpr($event),
        };
    }
}
