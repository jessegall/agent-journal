<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node;
use PhpParser\Node\Arg;
use PhpParser\Node\Expr;
use PhpParser\Node\Identifier;
use PhpParser\Node\Name;
use PhpParser\Node\Scalar\String_;
use PhpParser\Node\Stmt\ClassLike;
use PhpParser\Node\Stmt\ClassMethod;
use PhpParser\Node\Stmt\Property;
use PhpParser\NodeFinder;
use PhpParser\PrettyPrinter\Standard;
use Tests\Support\ScanCache\FileScan;

/**
 * Every call of a file that raises or listens to an event, with the type of event it passes.
 *
 * @implements FileScan<EventCall>
 */
final readonly class EventCallScan implements FileScan
{
    private const array EVENT_FACADES = ['Illuminate\\Support\\Facades\\Event', 'Event'];

    /**
     * Each call that raises or listens to an event, and whether it raises.
     */
    private const array FACADE_METHODS = ['listen' => false, 'subscribe' => false, 'dispatch' => true, 'until' => true];

    private const array HELPERS = ['event', 'broadcast'];

    private const array RECEIVER_METHODS = [
        'listen' => false,
        'subscribe' => false,
        'dispatch' => true,
        'until' => true,
        'raise' => true,
        'publishAfterCommit' => true,
    ];

    /**
     * The static calls a class sends itself with through Laravel's Dispatchable traits.
     */
    private const array DISPATCHABLE_METHODS = [
        'dispatch', 'dispatchSync', 'dispatchIf', 'dispatchUnless', 'broadcast',
    ];

    /**
     * The origins of a passed value whose class the code shows.
     */
    private const array SHOWN_CLASSES = [
        ReceiverOrigin::NewRow,
        ReceiverOrigin::OwnClass,
        ReceiverOrigin::OtherClass,
        ReceiverOrigin::OtherQuery,
    ];

    public function key(): string
    {
        return 'event-calls-5';
    }

    public function findingsIn(ParsedFile $file): array
    {
        return self::of($file);
    }

    /**
     * @return list<EventCall>
     */
    public static function of(ParsedFile $file): array
    {
        $calls = [];
        $finder = new NodeFinder();

        foreach ($finder->findInstanceOf($file->statements, Expr\FuncCall::class) as $call) {
            if (! $call->name instanceof Name || ! in_array($call->name->toLowerString(), self::HELPERS, true)) {
                continue;
            }

            $calls[] = self::eventCall($file, $call, $call->name->toString().'()', raises: true, takesOnlyEvents: true);
        }

        foreach ($finder->findInstanceOf($file->statements, Expr\StaticCall::class) as $call) {
            if (self::isDispatchableCall($call)) {
                $calls[] = self::dispatchableCall($file, $call);

                continue;
            }

            if (! self::isEventFacadeCall($call) || ! $call->name instanceof Identifier) {
                continue;
            }

            $method = $call->name->toString();
            $calls[] = self::eventCall(
                $file,
                $call,
                "Event::{$method}()",
                self::FACADE_METHODS[$method],
                takesOnlyEvents: true,
            );
        }

        foreach ($finder->findInstanceOf($file->statements, Expr\MethodCall::class) as $call) {
            if (! $call->name instanceof Identifier || ! isset(self::RECEIVER_METHODS[$call->name->toString()])) {
                continue;
            }

            $method = $call->name->toString();
            $calls[] = self::eventCall(
                $file,
                $call,
                "->{$method}()",
                self::RECEIVER_METHODS[$method],
                takesOnlyEvents: $method === 'listen',
            );
        }

        return [...$calls, ...self::declaredRegistrations($file)];
    }

    /**
     * Whether the method is an event subscriber's subscribe(Dispatcher).
     */
    private static function isSubscribeMethod(ClassMethod $method): bool
    {
        $type = ($method->params[0] ?? null)?->type;

        return $method->name->toLowerString() === 'subscribe'
            && $type instanceof Name
            && str_ends_with($type->toString(), 'Dispatcher');
    }

    /**
     * An event subscriber class, and a provider's listen or subscribe property that is not empty: both register
     * listeners by hand.
     *
     * @return list<EventCall>
     */
    private static function declaredRegistrations(ParsedFile $file): array
    {
        $registrations = [];
        $finder = new NodeFinder();

        foreach ($finder->findInstanceOf($file->statements, ClassMethod::class) as $method) {
            if (self::isSubscribeMethod($method)) {
                $registrations[] = new EventCall(
                    $file->path,
                    $method->getStartLine(),
                    'subscribe(Dispatcher)',
                    false,
                    false,
                    EventArgument::Other,
                    'an event subscriber',
                );
            }
        }

        foreach ($finder->findInstanceOf($file->statements, Property::class) as $property) {
            $name = $property->props[0]->name->toString();
            $default = $property->props[0]->default;

            if (in_array($name, ['listen', 'subscribe'], true)
                && $default instanceof Expr\Array_
                && $default->items !== []) {
                $registrations[] = new EventCall(
                    $file->path,
                    $property->getStartLine(),
                    "\${$name}",
                    false,
                    false,
                    EventArgument::Other,
                    "a {$name} property",
                );
            }
        }

        return $registrations;
    }

    /**
     * A class sending itself, such as TaskClosed::dispatch($id) on a class with Laravel's Dispatchable trait.
     */
    private static function isDispatchableCall(Expr\StaticCall $call): bool
    {
        return $call->class instanceof Name
            && ! in_array($call->class->toString(), [...self::EVENT_FACADES, 'self', 'static', 'parent'], true)
            && $call->name instanceof Identifier
            && in_array($call->name->toString(), self::DISPATCHABLE_METHODS, true);
    }

    private static function dispatchableCall(ParsedFile $file, Expr\StaticCall $call): EventCall
    {
        $class = $call->class instanceof Name ? $call->class->toString() : '';
        $method = $call->name instanceof Identifier ? $call->name->toString() : '';

        return new EventCall(
            $file->path,
            $call->getStartLine(),
            "{$class}::{$method}()",
            true,
            false,
            EventArgument::Other,
            $class,
            $class,
            null,
            self::siteOf($call),
        );
    }

    private static function isEventFacadeCall(Expr\StaticCall $call): bool
    {
        return $call->class instanceof Name
            && in_array($call->class->toString(), self::EVENT_FACADES, true)
            && $call->name instanceof Identifier
            && isset(self::FACADE_METHODS[$call->name->toString()]);
    }

    private static function eventCall(
        ParsedFile $file,
        Expr\CallLike $call,
        string $label,
        bool $raises,
        bool $takesOnlyEvents,
    ): EventCall {
        $first = $call->getArgs()[0] ?? null;
        $event = $first instanceof Arg ? $first->value : null;

        [$eventClass, $eventMethod] = $event === null ? [null, null] : self::sentEventOf($event, $call);

        return new EventCall(
            $file->path,
            $call->getStartLine(),
            $label,
            $raises,
            $takesOnlyEvents,
            self::argumentType($event, $call),
            self::eventText($event),
            $eventClass,
            $eventMethod,
            self::siteOf($call),
        );
    }

    /**
     * The class of the event passed where the code shows it, through a variable, a typed parameter, new or a static
     * factory on the class, or else the method whose returned value is passed.
     *
     * @return array{string|null, string|null}
     */
    private static function sentEventOf(Expr $event, Node $call): array
    {
        [$type, $method] = self::enclosingOf($call);

        if ($type === null || $method === null) {
            $made = $event instanceof Expr\New_ && $event->class instanceof Name ? $event->class->toString() : null;

            return [$made, null];
        }

        $receivers = MethodReceivers::of($type, false, $method);
        $value = $receivers->valueOf($event);
        $isReturned = ($value instanceof Expr\MethodCall || $value instanceof Expr\NullsafeMethodCall)
            && $value->name instanceof Identifier;

        if ($isReturned) {
            return [null, $value->name->toString()];
        }

        $receiver = $receivers->receiverOf($value);

        return [in_array($receiver->origin, self::SHOWN_CLASSES, true) ? $receiver->class : null, null];
    }

    /**
     * The class and method the call stands in, Class::method, or the file's top level.
     */
    private static function siteOf(Node $call): string
    {
        [$type, $method] = self::enclosingOf($call);

        $name = $method === null ? '' : $method->name->toString();

        return $type === null ? '' : ModelWriteScan::shortName($type)."::{$name}";
    }

    /**
     * @return array{string|null, ClassMethod|null}
     */
    private static function enclosingOf(Node $node): array
    {
        $method = null;
        $parent = $node->getAttribute('parent');

        while ($parent instanceof Node && ! $parent instanceof ClassLike) {
            $method ??= $parent instanceof ClassMethod ? $parent : null;
            $parent = $parent->getAttribute('parent');
        }

        $type = $parent instanceof ClassLike ? $parent->namespacedName?->toString() : null;

        return [$type, $method];
    }

    private static function argumentType(Expr|null $event, Node $call): EventArgument
    {
        return match (true) {
            $event instanceof String_ => EventArgument::String,
            $event instanceof Expr\Array_ && self::holdsOnlyStrings($event) => EventArgument::StringList,
            $event instanceof Expr\ClassConstFetch
                && $event->class instanceof Name
                && $event->name instanceof Identifier
                && $event->name->toLowerString() === 'class' => EventArgument::ClassName,
            $event instanceof Expr\Variable
                && $event->name === self::listenerParameter($call) => EventArgument::ListenerParameter,
            default => EventArgument::Other,
        };
    }

    private static function holdsOnlyStrings(Expr\Array_ $eventNames): bool
    {
        foreach ($eventNames->items as $eventNameItem) {
            if (! $eventNameItem->value instanceof String_) {
                return false;
            }
        }

        return $eventNames->items !== [];
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

        if (! $method instanceof ClassMethod) {
            return null;
        }

        $parameter = $method->params[0] ?? null;

        if ($parameter === null || ! $parameter->type instanceof Name || ! $parameter->var instanceof Expr\Variable) {
            return null;
        }

        if ($method->name->toLowerString() !== 'handle' && ! StateEventParameter::matches($parameter)) {
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
            default => new Standard()->prettyPrintExpr($event),
        };
    }
}
