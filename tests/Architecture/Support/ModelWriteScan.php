<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node;
use PhpParser\Node\Expr;
use PhpParser\Node\Stmt;
use PhpParser\NodeFinder;
use PhpParser\PrettyPrinter\Standard;
use Tests\Support\ScanCache\FileScan;

/**
 * What each method of the classes and traits of one file writes: the writes that leave its own row, each with its
 * line and the call that makes it, the calls it makes on other receivers, which ModelWrites resolves against every
 * model, and whether it writes its own row.
 *
 * @phpstan-type Write array{line: int, form: string, evidence: string}
 * @phpstan-type Call array{line: int, class: string|null, method: string, evidence: string}
 * @phpstan-type Method array{
 *     name: string, static: bool, writesOwnRow: bool, writes: list<Write>, calls: list<Call>, ownCalls: list<string>
 * }
 * @phpstan-type Type array{
 *     type: string, name: string, isTrait: bool, records: bool, traits: list<string>, touchesOwnersAt: int|null,
 *     methods: list<Method>
 * }
 *
 * @implements FileScan<Type>
 */
final readonly class ModelWriteScan implements FileScan
{
    /**
     * The contract and trait of a model that records the facts of its writes (plan 40, task 1578).
     */
    public const string EVENT_SOURCE = 'App\Contracts\EventSource';

    public const string RAISES_EVENTS = 'App\Concerns\RaisesEvents';

    /**
     * The trait whose insert of a model's own new row the capture of an event source sees.
     */
    public const string INSERTS_ABSENT_ROWS = 'App\Concerns\InsertsAbsentRows';

    /**
     * The Eloquent calls that write a row, a relation or a pivot.
     */
    private const array WRITES = [
        'save', 'update', 'delete', 'forceDelete', 'restore', 'push', 'touch', 'create', 'createMany', 'createQuietly',
        'forceCreate', 'insert', 'insertOrIgnore', 'insertGetId', 'insertUsing', 'upsert', 'updateOrCreate',
        'updateOrInsert', 'firstOrCreate', 'increment', 'decrement', 'incrementEach', 'decrementEach', 'saveMany',
        'attach', 'detach', 'sync', 'syncWithoutDetaching', 'syncWithPivotValues', 'toggle', 'updateExistingPivot',
        'saveQuietly', 'updateQuietly', 'deleteQuietly', 'touchQuietly', 'forceDeleteQuietly', 'truncate',
    ];

    /**
     * The writes a model may make on its own row.
     */
    private const array OWN_ROW_WRITES = [
        'save', 'update', 'delete', 'forceDelete', 'restore', 'touch', 'increment', 'decrement', 'incrementEach',
        'decrementEach', 'saveQuietly', 'updateQuietly', 'deleteQuietly', 'touchQuietly', 'forceDeleteQuietly',
    ];

    /**
     * The writes the capture of an event-recording model cannot see.
     */
    private const array QUIET_WRITES = [
        'increment', 'decrement', 'incrementEach', 'decrementEach', 'saveQuietly', 'updateQuietly', 'deleteQuietly',
        'touchQuietly', 'forceDeleteQuietly', 'insertOrIgnore', 'upsert', 'withoutEvents',
    ];

    private const array INSERTS = ['insert', 'insertOrIgnore', 'insertGetId', 'insertUsing', 'upsert'];

    private const array FINDS_OR_CREATES = ['firstOrCreate', 'updateOrCreate', 'updateOrInsert'];

    private const array DISPATCH_FUNCTIONS = ['dispatch', 'dispatch_sync', 'event', 'broadcast'];

    private const array FILE_FUNCTIONS = [
        'file_put_contents', 'fopen', 'fwrite', 'mkdir', 'rmdir', 'unlink', 'rename', 'copy', 'touch', 'chmod',
        'symlink', 'link', 'tempnam',
    ];

    private const array PROCESS_FUNCTIONS = [
        'proc_open', 'exec', 'shell_exec', 'system', 'passthru', 'popen', 'pcntl_exec',
    ];

    private const array DYNAMIC_FUNCTIONS = ['call_user_func', 'call_user_func_array'];

    /**
     * The facades whose calls dispatch or write outside the row, and what each does.
     */
    private const array FACADES = [
        'Illuminate\Support\Facades\DB' => 'writes the database directly',
        'Illuminate\Support\Facades\Event' => 'dispatches',
        'Illuminate\Support\Facades\Bus' => 'dispatches',
        'Illuminate\Support\Facades\Queue' => 'dispatches',
        'Illuminate\Support\Facades\Broadcast' => 'dispatches',
        'Illuminate\Support\Facades\Mail' => 'dispatches',
        'Illuminate\Support\Facades\Notification' => 'dispatches',
        'Illuminate\Support\Facades\Artisan' => 'runs a console command',
        'Illuminate\Support\Facades\Storage' => 'writes a file',
        'Illuminate\Support\Facades\File' => 'writes a file',
        'Illuminate\Support\Facades\Process' => 'starts a process',
    ];

    /**
     * The services a model may not take from the container, since each one writes or dispatches.
     */
    private const array WRITING_SERVICES = [
        'Illuminate\Contracts\Events\Dispatcher', 'Illuminate\Events\Dispatcher', 'Illuminate\Contracts\Bus\Dispatcher',
        'Illuminate\Bus\Dispatcher', 'App\Contracts\CommandBus', 'Illuminate\Contracts\Queue\Queue',
        'Illuminate\Database\DatabaseManager', 'Illuminate\Database\ConnectionInterface',
        'Illuminate\Contracts\Filesystem\Filesystem', 'Illuminate\Filesystem\Filesystem', 'events', 'db', 'bus',
        'queue', 'files', 'filesystem',
    ];

    private const array MODEL_EVENTS = [
        'creating', 'created', 'updating', 'updated', 'saving', 'saved', 'deleting', 'deleted', 'restoring',
        'restored', 'observe',
    ];

    private const array PROCESS_CLASSES = ['Symfony\Component\Process\Process'];

    /**
     * Whether the method is one of Eloquent's own writes.
     */
    public static function isWrite(string $method): bool
    {
        return in_array($method, self::WRITES, true);
    }

    public function key(): string
    {
        return 'model-writes-4';
    }

    public function findingsIn(ParsedFile $file): array
    {
        return self::of($file);
    }

    /**
     * The short name of a class, without its namespace.
     */
    public static function shortName(string $class): string
    {
        return substr((string) strrchr('\\'.$class, '\\'), 1);
    }

    /**
     * @return list<Type>
     */
    public static function of(ParsedFile $file): array
    {
        $scan = new self();
        $types = [];

        foreach (new NodeFinder()->findInstanceOf($file->statements, Stmt\ClassLike::class) as $type) {
            if (! ($type instanceof Stmt\Class_ || $type instanceof Stmt\Trait_) || $type->namespacedName === null) {
                continue;
            }

            $types[] = $scan->typeOf($type);
        }

        return $types;
    }

    /**
     * The method name of a call on an object, when the code names it.
     */
    private static function methodNameOf(Node $call): string|null
    {
        $isMethodCall = $call instanceof Expr\MethodCall || $call instanceof Expr\NullsafeMethodCall;

        return $isMethodCall && $call->name instanceof Node\Identifier ? $call->name->toString() : null;
    }

    /**
     * The object a named method is called on, when the call is one.
     */
    private static function objectOf(Expr\CallLike $call): Expr|null
    {
        $isMethodCall = $call instanceof Expr\MethodCall || $call instanceof Expr\NullsafeMethodCall;

        return $isMethodCall && $call->name instanceof Node\Identifier ? $call->var : null;
    }

    /**
     * The class and method of a static call, when the code names both.
     *
     * @return array{string, string}|null
     */
    private static function staticCallOf(Node $call): array|null
    {
        $isNamed = $call instanceof Expr\StaticCall
            && $call->class instanceof Node\Name
            && $call->name instanceof Node\Identifier;

        return $isNamed ? [$call->class->toString(), $call->name->toString()] : null;
    }

    /**
     * @return Type
     */
    private function typeOf(Stmt\Class_|Stmt\Trait_ $type): array
    {
        $traits = [];

        foreach ($type->getTraitUses() as $use) {
            foreach ($use->traits as $trait) {
                $traits[] = $trait->toString();
            }
        }

        $implements = $type instanceof Stmt\Class_ ? $type->implements : [];
        $contracts = array_map(fn (Node\Name $contract) => $contract->toString(), $implements);
        $name = (string) $type->namespacedName;
        $records = in_array(self::EVENT_SOURCE, $contracts, true) || in_array(self::RAISES_EVENTS, $traits, true);
        $rowMakers = $this->rowMakersOf($type, $name);
        $methods = [];

        foreach ($type->getMethods() as $method) {
            $methods[] = $this->methodOf(MethodReceivers::of($name, $records, $method, $rowMakers), $method);
        }

        return [
            'type' => $name,
            'name' => (string) $type->name,
            'isTrait' => $type instanceof Stmt\Trait_,
            'records' => $records,
            'traits' => $traits,
            'touchesOwnersAt' => $this->touchesOwnersAt($type),
            'methods' => $methods,
        ];
    }

    /**
     * The static methods that answer a new row of the class: every return gives back new self or a variable given it.
     *
     * @return list<string>
     */
    private function rowMakersOf(Stmt\Class_|Stmt\Trait_ $type, string $name): array
    {
        $makers = [];

        foreach ($type->getMethods() as $method) {
            $receivers = MethodReceivers::of($name, false, $method);
            $returns = new NodeFinder()->findInstanceOf($method->stmts ?? [], Stmt\Return_::class);
            $answersNewRows = $returns !== [] && array_all(
                $returns,
                fn (Stmt\Return_ $return) => $return->expr !== null
                    && $receivers->receiverOf($return->expr)->origin === ReceiverOrigin::NewRow,
            );

            if ($method->isStatic() && $answersNewRows) {
                $makers[] = $method->name->toString();
            }
        }

        return $makers;
    }

    /**
     * The line of the model's non-empty $touches, which saves its owners whenever it saves.
     */
    private function touchesOwnersAt(Stmt\Class_|Stmt\Trait_ $type): int|null
    {
        foreach ($type->getProperties() as $property) {
            foreach ($property->props as $declared) {
                $touches = $declared->name->toString() === 'touches'
                    && $declared->default instanceof Expr\Array_
                    && $declared->default->items !== [];

                if ($touches) {
                    return $declared->getStartLine();
                }
            }
        }

        return null;
    }

    /**
     * @return Method
     */
    private function methodOf(MethodReceivers $context, Stmt\ClassMethod $method): array
    {
        $writes = [];
        $calls = [];
        $ownCalls = [];
        $writesOwnRow = false;

        foreach (new NodeFinder()->findInstanceOf($method->stmts ?? [], Expr\CallLike::class) as $call) {
            $line = $call->getStartLine();
            $evidence = $this->evidenceOf($call);

            foreach ($this->writesOf($call, $context) as $form) {
                $writes[] = ['line' => $line, 'form' => $form, 'evidence' => $evidence];
            }

            $writesOwnRow = $writesOwnRow || $this->writesOwnRow($call, $context);
            $own = $this->ownCallOf($call, $context);
            $other = $this->otherCallOf($call, $context);

            if ($own !== null) {
                $ownCalls[] = $own;
            }

            if ($other !== null) {
                $calls[] = ['line' => $line, ...$other, 'evidence' => $evidence];
            }
        }

        return [
            'name' => $method->name->toString(),
            'static' => $method->isStatic(),
            'writesOwnRow' => $writesOwnRow,
            'writes' => $writes,
            'calls' => $calls,
            'ownCalls' => array_values(array_unique($ownCalls)),
        ];
    }

    /**
     * What the call writes outside its own row, as the forms the report names.
     *
     * @return list<string>
     */
    private function writesOf(Expr\CallLike $call, MethodReceivers $context): array
    {
        return match (true) {
            $call instanceof Expr\MethodCall => $this->methodWrites($call, $context),
            $call instanceof Expr\NullsafeMethodCall => $this->methodWrites($call, $context),
            $call instanceof Expr\StaticCall => $this->staticWrites($call, $context),
            $call instanceof Expr\FuncCall => $this->functionWrites($call, $context),
            $call instanceof Expr\New_ => $this->newWrites($call),
            default => [],
        };
    }

    /**
     * @return list<string>
     */
    private function methodWrites(Expr\MethodCall|Expr\NullsafeMethodCall $call, MethodReceivers $context): array
    {
        $method = self::methodNameOf($call);

        if ($method === null) {
            return ['calls a method by a dynamic name'];
        }

        if ($method === 'make' && $this->takesWritingService($call)) {
            return ['takes a writing service from the container'];
        }

        if (! in_array($method, self::WRITES, true)) {
            return [];
        }

        $receiver = $context->receiverOf($call->var);
        $class = self::shortName((string) $receiver->class);
        $isFacade = isset(self::FACADES[(string) $receiver->class]);
        $anotherRow = ['writes another row of its class'];

        return match ($receiver->origin) {
            ReceiverOrigin::Own => $this->ownRowWrites($method, $context),
            ReceiverOrigin::NewRow => $context->isStatic ? $this->ownRowWrites($method, $context) : $anotherRow,
            ReceiverOrigin::OwnQuery => $this->queryWrites($method, $call, $context),
            ReceiverOrigin::Relation => ['writes through a relation'],
            ReceiverOrigin::Property => ['writes the row of a related model'],
            ReceiverOrigin::OwnClass => $anotherRow,
            ReceiverOrigin::OtherClass => ["writes a row of {$class}"],
            ReceiverOrigin::OtherQuery => $isFacade ? [] : ["writes rows of {$class} by query"],
            ReceiverOrigin::Unknown => ['writes another row'],
        };
    }

    /**
     * @return list<string>
     */
    private function ownRowWrites(string $method, MethodReceivers $context): array
    {
        if ($context->records && in_array($method, self::QUIET_WRITES, true)) {
            return ['writes quietly, where the capture cannot see it'];
        }

        $staysOnOwnRow = in_array($method, self::OWN_ROW_WRITES, true) || $method === 'create';

        return $staysOnOwnRow ? [] : ['writes through a relation'];
    }

    /**
     * @return list<string>
     */
    private function queryWrites(
        string $method,
        Expr\MethodCall|Expr\NullsafeMethodCall $call,
        MethodReceivers $context,
    ): array {
        $makesRows = $method === 'create' || $method === 'insert';
        $isNewRow = $makesRows && $context->isStatic && $context->isPlainQuery($call->var);

        return match (true) {
            $isNewRow => [],
            in_array($method, self::INSERTS, true) => ['inserts rows by query'],
            in_array($method, self::FINDS_OR_CREATES, true) => ['finds or creates a row by query'],
            default => ['writes rows by query'],
        };
    }

    /**
     * @return list<string>
     */
    private function staticWrites(Expr\StaticCall $call, MethodReceivers $context): array
    {
        $named = self::staticCallOf($call);

        if ($named === null) {
            return ['calls a method by a dynamic name'];
        }

        [$class, $method] = $named;

        return match (true) {
            isset(self::FACADES[$class]) => [self::FACADES[$class]],
            $context->isOwnClass($class) => $this->ownStaticWrites($method, $call, $context),
            $method === 'dispatch', $method === 'dispatchSync' => ['dispatches'],
            default => [],
        };
    }

    /**
     * @return list<string>
     */
    private function ownStaticWrites(string $method, Expr\StaticCall $call, MethodReceivers $context): array
    {
        $listener = $call->args[0] ?? null;
        $isClosure = $listener instanceof Node\Arg
            && ($listener->value instanceof Expr\Closure || $listener->value instanceof Expr\ArrowFunction);

        return match (true) {
            in_array($method, self::MODEL_EVENTS, true) => $isClosure ? [] : ['registers a model observer'],
            $method === 'withoutEvents' && $context->records => ['writes quietly, where the capture cannot see it'],
            $method === 'create' => $context->isStatic ? [] : ['writes another row of its class'],
            in_array($method, self::WRITES, true) => ['writes rows by query'],
            default => [],
        };
    }

    /**
     * @return list<string>
     */
    private function functionWrites(Expr\FuncCall $call, MethodReceivers $context): array
    {
        $variable = $call->name instanceof Expr\Variable && is_string($call->name->name) ? $call->name->name : null;

        if ($variable !== null && $context->isLocalFunction($variable)) {
            return [];
        }

        if (! $call->name instanceof Node\Name) {
            return ['calls an unknown callable'];
        }

        $function = $call->name->toLowerString();
        $takesService = in_array($function, ['app', 'resolve'], true) && $this->namesWritingService($call->args);

        return match (true) {
            in_array($function, self::DISPATCH_FUNCTIONS, true) => ['dispatches'],
            in_array($function, self::FILE_FUNCTIONS, true) => ['writes a file'],
            in_array($function, self::PROCESS_FUNCTIONS, true) => ['starts a process'],
            in_array($function, self::DYNAMIC_FUNCTIONS, true) => ['calls an unknown callable'],
            $takesService => ['takes a writing service from the container'],
            default => [],
        };
    }

    /**
     * @return list<string>
     */
    private function newWrites(Expr\New_ $call): array
    {
        $class = $call->class instanceof Node\Name ? $call->class->toString() : null;

        return in_array($class, self::PROCESS_CLASSES, true) ? ['starts a process'] : [];
    }

    private function takesWritingService(Expr\MethodCall|Expr\NullsafeMethodCall $call): bool
    {
        $root = self::staticCallOf($call->var);

        return $root !== null
            && $root[0] === 'Illuminate\Container\Container'
            && $this->namesWritingService($call->args);
    }

    /**
     * @param  array<Node>  $arguments
     */
    private function namesWritingService(array $arguments): bool
    {
        $first = $arguments[0] ?? null;

        if (! $first instanceof Node\Arg) {
            return false;
        }

        $value = $first->value;
        $name = match (true) {
            $value instanceof Expr\ClassConstFetch && $value->class instanceof Node\Name => $value->class->toString(),
            $value instanceof Node\Scalar\String_ => $value->value,
            default => null,
        };

        return in_array($name, self::WRITING_SERVICES, true);
    }

    private function writesOwnRow(Expr\CallLike $call, MethodReceivers $context): bool
    {
        $method = self::methodNameOf($call);
        $static = self::staticCallOf($call);
        $object = self::objectOf($call);

        if ($object !== null && in_array($method, self::WRITES, true)) {
            $origin = $context->receiverOf($object)->origin;

            return $origin->isOwnSide() && $origin !== ReceiverOrigin::Relation;
        }

        return $static !== null && $context->isOwnClass($static[0]) && in_array($static[1], self::WRITES, true);
    }

    /**
     * The method of its own class or trait the call runs on this object or statically, if it is one.
     */
    private function ownCallOf(Expr\CallLike $call, MethodReceivers $context): string|null
    {
        $method = self::methodNameOf($call);
        $static = self::staticCallOf($call);
        $object = self::objectOf($call);

        if ($object !== null) {
            return $context->receiverOf($object)->origin === ReceiverOrigin::Own ? $method : null;
        }

        return $static !== null && $context->isOwnClass($static[0]) ? $static[1] : null;
    }

    /**
     * A call of a named method on a receiver other than this object, with the receiver's class where it is known.
     *
     * @return array{class: string|null, method: string}|null
     */
    private function otherCallOf(Expr\CallLike $call, MethodReceivers $context): array|null
    {
        $method = self::methodNameOf($call);
        $static = self::staticCallOf($call);

        if ($static !== null) {
            return $context->isOwnClass($static[0]) ? null : ['class' => $static[0], 'method' => $static[1]];
        }

        $object = self::objectOf($call);

        if ($object === null || $method === null || in_array($method, self::WRITES, true)) {
            return null;
        }

        $receiver = $context->receiverOf($object);

        return $receiver->origin->isOwnSide() ? null : ['class' => $receiver->class, 'method' => $method];
    }

    private function evidenceOf(Expr\CallLike $call): string
    {
        $printed = preg_replace('/\s+/', ' ', new Standard()->prettyPrintExpr($call)) ?? '';

        return strlen($printed) > 120 ? substr($printed, 0, 117).'...' : $printed;
    }
}
