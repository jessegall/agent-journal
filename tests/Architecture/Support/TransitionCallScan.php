<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node;
use PhpParser\Node\Expr;
use PhpParser\Node\Stmt;
use PhpParser\NodeFinder;
use Tests\Support\ScanCache\FileScan;

/**
 * The calls of a file to the methods the given transitions name, each with its line, the class and method it stands
 * in, and the receiver's class where the code shows it.
 *
 * @phpstan-type TransitionCall array{line: int, type: string, site: string, method: string, receiver: string|null}
 *
 * @implements FileScan<TransitionCall>
 */
final readonly class TransitionCallScan implements FileScan
{
    /**
     * The origins of a receiver whose class the code shows.
     */
    private const array SHOWN_CLASSES = [
        ReceiverOrigin::Own,
        ReceiverOrigin::NewRow,
        ReceiverOrigin::OwnClass,
        ReceiverOrigin::OtherClass,
        ReceiverOrigin::OtherQuery,
    ];

    /**
     * @param  list<string>  $transitions  each transition as Class::method
     */
    public function __construct(private array $transitions) {}

    public function key(): string
    {
        return 'transition-calls-1-'.md5(implode(',', $this->transitions));
    }

    /**
     * @return list<TransitionCall>
     */
    public function findingsIn(ParsedFile $file): array
    {
        $methods = array_unique(
            array_map(fn (string $transition) => explode('::', $transition)[1] ?? '', $this->transitions),
        );
        $calls = [];

        foreach (new NodeFinder()->findInstanceOf($file->statements, Stmt\ClassLike::class) as $type) {
            $name = $type->namespacedName?->toString();

            if ($name === null) {
                continue;
            }

            foreach ($type->getMethods() as $method) {
                $receivers = MethodReceivers::of($name, false, $method);

                foreach (new NodeFinder()->findInstanceOf($method->stmts ?? [], Expr\CallLike::class) as $call) {
                    $called = self::calledMethodOf($call);

                    if ($called !== null && in_array($called, $methods, true)) {
                        $calls[] = [
                            'line' => $call->getStartLine(),
                            'type' => $name,
                            'site' => ModelWriteScan::shortName($name).'::'.$method->name->toString(),
                            'method' => $called,
                            'receiver' => self::receiverClassOf($call, $receivers),
                        ];
                    }
                }
            }
        }

        return $calls;
    }

    private static function calledMethodOf(Expr\CallLike $call): string|null
    {
        $isCall = $call instanceof Expr\MethodCall
            || $call instanceof Expr\NullsafeMethodCall
            || $call instanceof Expr\StaticCall;

        return $isCall && $call->name instanceof Node\Identifier ? $call->name->toString() : null;
    }

    private static function receiverClassOf(Expr\CallLike $call, MethodReceivers $receivers): string|null
    {
        if ($call instanceof Expr\StaticCall) {
            $class = $call->class instanceof Node\Name ? $call->class->toString() : null;

            return $class !== null && $receivers->isOwnClass($class) ? $receivers->type : $class;
        }

        if (! $call instanceof Expr\MethodCall && ! $call instanceof Expr\NullsafeMethodCall) {
            return null;
        }

        $receiver = $receivers->receiverOf($call->var);

        return in_array($receiver->origin, self::SHOWN_CLASSES, true) ? $receiver->class : null;
    }
}
