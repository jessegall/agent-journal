<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node;
use PhpParser\Node\Expr;
use PhpParser\Node\Stmt;
use PhpParser\NodeFinder;

/**
 * The receivers of one model method's calls: this object and its aliases, the new row a static constructor makes,
 * queries and rows of its own class, relations, and objects of other classes. A variable takes the origin of the
 * last value given it before the call, a typed parameter its class; anything else is unknown.
 */
final readonly class MethodReceivers
{
    /**
     * The calls on a query that answer one row.
     */
    private const array ROW_ANSWERS = ['first', 'firstOrFail', 'sole', 'find', 'findOrFail', 'firstOr', 'firstWhere'];

    /**
     * The calls on a query that answer a collection of its rows.
     */
    private const array ROWS_ANSWERS = ['get', 'all', 'keyBy', 'groupBy', 'cursor', 'lazy', 'findMany'];

    /**
     * The calls on the model itself that answer the same object.
     */
    private const array SAME_OBJECT = [
        'fill', 'forceFill', 'setAttribute', 'setRawAttributes', 'refresh', 'setRelation', 'unsetRelation',
        'syncOriginal', 'makeHidden', 'makeVisible',
    ];

    private const array OWN_QUERIES = ['newQuery', 'newModelQuery', 'query'];

    /**
     * @param  list<array{name: string, position: int, value: Expr|null}>  $assignments
     * @param  array<string, string>  $parameterTypes  each typed parameter's class, by name
     * @param  list<string>  $rowMakers  the static methods of its own class that answer a new row of it
     */
    private function __construct(
        public string $type,
        public bool $records,
        public bool $isStatic,
        private array $assignments,
        private array $parameterTypes,
        private array $rowMakers,
    ) {}

    /**
     * @param  list<string>  $rowMakers
     */
    public static function of(string $type, bool $records, Stmt\ClassMethod $method, array $rowMakers = []): self
    {
        $assignments = [];
        $parameterTypes = [];
        $finder = new NodeFinder();
        $functions = $finder->find($method->stmts ?? [], fn (Node $node) => $node instanceof Expr\Closure || $node instanceof Expr\ArrowFunction);

        foreach ([$method, ...$functions] as $function) {
            /** @var Stmt\ClassMethod|Expr\Closure|Expr\ArrowFunction $function */
            foreach ($function->params as $parameter) {
                if ($parameter->var instanceof Expr\Variable && is_string($parameter->var->name) && $parameter->type instanceof Node\Name) {
                    $parameterTypes[$parameter->var->name] = $parameter->type->toString();
                }
            }
        }

        foreach ($finder->findInstanceOf($method->stmts ?? [], Expr\Assign::class) as $assign) {
            if ($assign->var instanceof Expr\Variable && is_string($assign->var->name)) {
                $assignments[] = ['name' => $assign->var->name, 'position' => $assign->getEndFilePos(), 'value' => $assign->expr];
            }
        }

        foreach ($finder->findInstanceOf($method->stmts ?? [], Stmt\Foreach_::class) as $loop) {
            if ($loop->valueVar instanceof Expr\Variable && is_string($loop->valueVar->name)) {
                $assignments[] = ['name' => $loop->valueVar->name, 'position' => $loop->getStartFilePos(), 'value' => null];
            }
        }

        return new self($type, $records, $method->isStatic(), $assignments, $parameterTypes, $rowMakers);
    }

    /**
     * Whether the variable holds a closure the method made itself, so calling it runs code the scan reads.
     */
    public function isLocalFunction(string $name): bool
    {
        foreach ($this->assignments as $assignment) {
            if ($assignment['name'] === $name && ($assignment['value'] instanceof Expr\Closure || $assignment['value'] instanceof Expr\ArrowFunction)) {
                return true;
            }
        }

        return false;
    }

    public function isOwnClass(string $class): bool
    {
        return in_array(strtolower($class), ['self', 'static', strtolower($this->type)], true);
    }

    /**
     * Whether the expression is the bare query of its own class, self::query().
     */
    public function isPlainQuery(Expr $expression): bool
    {
        return $expression instanceof Expr\StaticCall
            && $expression->class instanceof Node\Name
            && $this->isOwnClass($expression->class->toString())
            && $expression->name instanceof Node\Identifier
            && $expression->name->toString() === 'query';
    }

    public function receiverOf(Expr $expression): Receiver
    {
        return match (true) {
            $expression instanceof Expr\Variable => $this->variable($expression),
            $expression instanceof Expr\New_ => $this->made($expression),
            $expression instanceof Expr\PropertyFetch, $expression instanceof Expr\NullsafePropertyFetch => $this->property($expression),
            $expression instanceof Expr\MethodCall, $expression instanceof Expr\NullsafeMethodCall => $this->chained($expression),
            $expression instanceof Expr\StaticCall => $this->static($expression),
            $expression instanceof Expr\BinaryOp\Coalesce => $this->receiverOf($expression->left),
            $expression instanceof Expr\Clone_ => $this->receiverOf($expression->expr),
            default => Receiver::unknown(),
        };
    }

    private function variable(Expr\Variable $variable): Receiver
    {
        if (! is_string($variable->name)) {
            return Receiver::unknown();
        }

        if ($variable->name === 'this') {
            return new Receiver(ReceiverOrigin::Own, $this->type);
        }

        $value = $this->lastValueOf($variable->name, $variable->getStartFilePos());

        if ($value !== false) {
            return $value === null ? Receiver::unknown() : $this->assigned($this->receiverOf($value), $value);
        }

        $class = $this->parameterTypes[$variable->name] ?? null;

        return match (true) {
            $class === null => Receiver::unknown(),
            $this->isOwnClass($class) => new Receiver(ReceiverOrigin::OwnClass, $this->type),
            default => new Receiver(ReceiverOrigin::OtherClass, $class),
        };
    }

    /**
     * What a variable holds once the value was given it: a query only when the value is built on query(), else
     * the row its own class's static method answered.
     */
    private function assigned(Receiver $receiver, Expr $value): Receiver
    {
        return match (true) {
            $receiver->origin === ReceiverOrigin::Relation => Receiver::unknown(),
            $receiver->origin === ReceiverOrigin::OwnQuery && ! $this->isBuiltOnQuery($value) => new Receiver(ReceiverOrigin::OwnClass, $this->type),
            default => $receiver,
        };
    }

    private function isBuiltOnQuery(Expr $value): bool
    {
        while ($value instanceof Expr\MethodCall || $value instanceof Expr\NullsafeMethodCall) {
            $value = $value->var;
        }

        return $this->isPlainQuery($value);
    }

    /**
     * The value last given the variable before the position: false when it was never given one, null when a loop
     * gave it each element.
     */
    private function lastValueOf(string $name, int $position): Expr|null|false
    {
        $last = false;
        $lastPosition = -1;

        foreach ($this->assignments as $assignment) {
            if ($assignment['name'] === $name && $assignment['position'] < $position && $assignment['position'] > $lastPosition) {
                $last = $assignment['value'];
                $lastPosition = $assignment['position'];
            }
        }

        return $last;
    }

    private function made(Expr\New_ $made): Receiver
    {
        if (! $made->class instanceof Node\Name) {
            return Receiver::unknown();
        }

        $class = $made->class->toString();

        return $this->isOwnClass($class) ? new Receiver(ReceiverOrigin::NewRow, $this->type) : new Receiver(ReceiverOrigin::OtherClass, $class);
    }

    private function property(Expr\PropertyFetch|Expr\NullsafePropertyFetch $property): Receiver
    {
        $owner = $this->receiverOf($property->var);

        return $owner->origin === ReceiverOrigin::Own ? new Receiver(ReceiverOrigin::Property) : Receiver::unknown();
    }

    private function chained(Expr\MethodCall|Expr\NullsafeMethodCall $call): Receiver
    {
        $receiver = $this->receiverOf($call->var);
        $method = $call->name instanceof Node\Identifier ? $call->name->toString() : '';

        return match (true) {
            $receiver->origin->isOwnRow() && in_array($method, self::SAME_OBJECT, true) => $receiver,
            $receiver->origin === ReceiverOrigin::Own && in_array($method, self::OWN_QUERIES, true) => new Receiver(ReceiverOrigin::OwnQuery, $this->type),
            $receiver->origin->isOwnRow() => new Receiver(ReceiverOrigin::Relation),
            in_array($method, self::ROW_ANSWERS, true) => new Receiver($receiver->origin->rowOfQuery(), $receiver->class),
            $receiver->origin->isQuery() && in_array($method, self::ROWS_ANSWERS, true) => new Receiver(ReceiverOrigin::Unknown, $receiver->class),
            $receiver->origin === ReceiverOrigin::OwnQuery && $method === 'create' => new Receiver(ReceiverOrigin::NewRow, $this->type),
            $receiver->origin->isQuery() => $receiver,
            default => new Receiver(ReceiverOrigin::Unknown, $receiver->class),
        };
    }

    private function static(Expr\StaticCall $call): Receiver
    {
        if (! $call->class instanceof Node\Name || ! $call->name instanceof Node\Identifier) {
            return Receiver::unknown();
        }

        $class = $call->class->toString();
        $isCreate = $call->name->toString() === 'create';

        return match (true) {
            $this->isOwnClass($class) && ($isCreate || in_array($call->name->toString(), $this->rowMakers, true)) => new Receiver(ReceiverOrigin::NewRow, $this->type),
            $this->isOwnClass($class) => new Receiver(ReceiverOrigin::OwnQuery, $this->type),
            default => new Receiver(ReceiverOrigin::OtherQuery, $class),
        };
    }
}
