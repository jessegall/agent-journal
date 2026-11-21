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
 * @phpstan-type Method array{name: string, static: bool, writesOwnRow: bool, writes: list<Write>, calls: list<Call>, ownCalls: list<string>}
 * @phpstan-type Type array{type: string, name: string, isTrait: bool, records: bool, traits: list<string>, touchesOwnersAt: int|null, methods: list<Method>}
 *
 * @implements FileScan<Type>
 */
final readonly class ModelWriteScan implements FileScan
{
    /**
     * The contract and trait of a model that records the facts of its writes (plan 40, task 1578).
     */
    public const string EVENT_SOURCE = 'App\Contracts\EventSource';

    public const string RAISES_EVENTS = 'App\Contracts\RaisesEvents';

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

    private const array PROCESS_FUNCTIONS = ['proc_open', 'exec', 'shell_exec', 'system', 'passthru', 'popen', 'pcntl_exec'];

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
        'Illuminate\Bus\Dispatcher', 'App\Bus\Contracts\CommandBus', 'Illuminate\Contracts\Queue\Queue',
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
        return 'model-writes-3';
    }

    public function findingsIn(ParsedFile $file): array
    {
        return self::of($file);
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

        $implements = $type instanceof Stmt\Class_ ? array_map(fn (Node\Name $name) => $name->toString(), $type->implements) : [];
        $name = (string) $type->namespacedName;
        $records = in_array(self::EVENT_SOURCE, $implements, true) || in_array(self::RAISES_EVENTS, $traits, true);
        $rowMakers = $this->rowMakersOf($type, $name);

        return [
            'type' => $name,
            'name' => (string) $type->name,
            'isTrait' => $type instanceof Stmt\Trait_,
            'records' => $records,
            'traits' => $traits,
            'touchesOwnersAt' => $this->touchesOwnersAt($type),
            'methods' => array_map(
                fn (Stmt\ClassMethod $method) => $this->methodOf(MethodReceivers::of($name, $records, $method, $rowMakers), $method),
                $type->getMethods(),
            ),
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
                fn (Stmt\Return_ $return) => $return->expr !== null && $receivers->receiverOf($return->expr)->origin === ReceiverOrigin::NewRow,
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

        foreach (new NodeFinder()->find($method->stmts ?? [], fn (Node $node) => $node instanceof Expr\CallLike) as $call) {
            $line = $call->getStartLine();
            $evidence = $this->evidenceOf($call);

            foreach ($this->writesOf($call, $context) as $form) {
                $writes[] = ['line' => $line, 'form' => $form, 'evidence' => $evidence];
            }

            if ($this->writesOwnRow($call, $context)) {
                $writesOwnRow = true;
            }

            $own = $this->ownCallOf($call, $context);

            if ($own !== null) {
                $ownCalls[] = $own;
            }

            $other = $this->otherCallOf($call, $context);

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
    private function writesOf(Node $call, MethodReceivers $context): array
    {
        return match (true) {
            $call instanceof Expr\MethodCall, $call instanceof Expr\NullsafeMethodCall => $this->methodWrites($call, $context),
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
        if (! $call->name instanceof Node\Identifier) {
            return ['calls a method by a dynamic name'];
        }

        $method = $call->name->toString();

        if ($method === 'make' && $this->takesWritingService($call)) {
            return ['takes a writing service from the container'];
        }

        if (! in_array($method, self::WRITES, true)) {
            return [];
        }

        $receiver = $context->receiverOf($call->var);

        return match ($receiver->origin) {
            ReceiverOrigin::Own => $this->ownRowWrites($method, $context),
            ReceiverOrigin::NewRow => $context->isStatic ? $this->ownRowWrites($method, $context) : ['writes another row of its class'],
            ReceiverOrigin::OwnQuery => $this->queryWrites($method, $call, $context),
            ReceiverOrigin::Relation => ['writes through a relation'],
            ReceiverOrigin::Property => ['writes the row of a related model'],
            ReceiverOrigin::OwnClass => ['writes another row of its class'],
            ReceiverOrigin::OtherClass => ['writes a row of '.self::shortName((string) $receiver->class)],
            ReceiverOrigin::OtherQuery => ['writes rows of '.self::shortName((string) $receiver->class).' by query'],
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

        return in_array($method, self::OWN_ROW_WRITES, true) || $method === 'create' ? [] : ['writes through a relation'];
    }

    /**
     * @return list<string>
     */
    private function queryWrites(string $method, Expr\MethodCall|Expr\NullsafeMethodCall $call, MethodReceivers $context): array
    {
        $isNewRow = $method === 'create' && $context->isStatic && $context->isPlainQuery($call->var);

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
        if (! $call->name instanceof Node\Identifier || ! $call->class instanceof Node\Name) {
            return ['calls a method by a dynamic name'];
        }

        $class = $call->class->toString();
        $method = $call->name->toString();

        if (isset(self::FACADES[$class])) {
            return [self::FACADES[$class]];
        }

        if ($context->isOwnClass($class)) {
            return $this->ownStaticWrites($method, $call, $context);
        }

        if ($method === 'dispatch' || $method === 'dispatchSync') {
            return ['dispatches'];
        }

        return [];
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
        $isLocal = $call->name instanceof Expr\Variable && is_string($call->name->name) && $context->isLocalFunction($call->name->name);

        if ($isLocal) {
            return [];
        }

        if (! $call->name instanceof Node\Name) {
            return ['calls an unknown callable'];
        }

        $function = $call->name->toLowerString();

        return match (true) {
            in_array($function, self::DISPATCH_FUNCTIONS, true) => ['dispatches'],
            in_array($function, self::FILE_FUNCTIONS, true) => ['writes a file'],
            in_array($function, self::PROCESS_FUNCTIONS, true) => ['starts a process'],
            in_array($function, self::DYNAMIC_FUNCTIONS, true) => ['calls an unknown callable'],
            in_array($function, ['app', 'resolve'], true) && $this->namesWritingService($call->args) => [
                'takes a writing service from the container',
            ],
            default => [],
        };
    }

    /**
     * @return list<string>
     */
    private function newWrites(Expr\New_ $call): array
    {
        $isProcess = $call->class instanceof Node\Name && in_array($call->class->toString(), self::PROCESS_CLASSES, true);

        return $isProcess ? ['starts a process'] : [];
    }

    private function takesWritingService(Expr\MethodCall|Expr\NullsafeMethodCall $call): bool
    {
        return $call->var instanceof Expr\StaticCall
            && $call->var->class instanceof Node\Name
            && $call->var->class->toString() === 'Illuminate\Container\Container'
            && $this->namesWritingService($call->args);
    }

    /**
     * @param  array<Node\Arg|Node\VariadicPlaceholder>  $arguments
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

    private function writesOwnRow(Node $call, MethodReceivers $context): bool
    {
        $isMethodWrite = ($call instanceof Expr\MethodCall || $call instanceof Expr\NullsafeMethodCall)
            && $call->name instanceof Node\Identifier
            && in_array($call->name->toString(), self::WRITES, true);

        if ($isMethodWrite) {
            return $context->receiverOf($call->var)->origin->isOwnSide()
                && $context->receiverOf($call->var)->origin !== ReceiverOrigin::Relation;
        }

        return $call instanceof Expr\StaticCall
            && $call->name instanceof Node\Identifier
            && $call->class instanceof Node\Name
            && $context->isOwnClass($call->class->toString())
            && in_array($call->name->toString(), self::WRITES, true);
    }

    /**
     * The method of its own class or trait the call runs on this object or statically, if it is one.
     */
    private function ownCallOf(Node $call, MethodReceivers $context): string|null
    {
        if (($call instanceof Expr\MethodCall || $call instanceof Expr\NullsafeMethodCall) && $call->name instanceof Node\Identifier) {
            return $context->receiverOf($call->var)->origin === ReceiverOrigin::Own ? $call->name->toString() : null;
        }

        $isOwnStatic = $call instanceof Expr\StaticCall
            && $call->name instanceof Node\Identifier
            && $call->class instanceof Node\Name
            && $context->isOwnClass($call->class->toString());

        return $isOwnStatic ? $call->name->toString() : null;
    }

    /**
     * A call of a named method on a receiver other than this object, with the receiver's class where it is known.
     *
     * @return array{class: string|null, method: string}|null
     */
    private function otherCallOf(Node $call, MethodReceivers $context): array|null
    {
        if ($call instanceof Expr\StaticCall && $call->name instanceof Node\Identifier && $call->class instanceof Node\Name) {
            $class = $call->class->toString();

            return $context->isOwnClass($class) ? null : ['class' => $class, 'method' => $call->name->toString()];
        }

        if (! ($call instanceof Expr\MethodCall || $call instanceof Expr\NullsafeMethodCall) || ! $call->name instanceof Node\Identifier) {
            return null;
        }

        $method = $call->name->toString();

        if (in_array($method, self::WRITES, true)) {
            return null;
        }

        $receiver = $context->receiverOf($call->var);

        return $receiver->origin->isOwnSide() ? null : ['class' => $receiver->class, 'method' => $method];
    }

    public static function shortName(string $class): string
    {
        return substr((string) strrchr('\\'.$class, '\\'), 1);
    }

    private function evidenceOf(Node $call): string
    {
        $printed = preg_replace('/\s+/', ' ', new Standard()->prettyPrintExpr($call)) ?? '';

        return strlen($printed) > 120 ? substr($printed, 0, 117).'...' : $printed;
    }
}
