<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node;
use PhpParser\Node\Expr;
use PhpParser\Node\Stmt;
use PhpParser\NodeFinder;
use Tests\Support\ScanCache\FileScan;

/**
 * The calls inside a state's methods that change something directly: running a command, writing a row, sending an
 * event or a job, writing a file or starting a process. A state answers with commands the engine runs; constructing
 * and returning one is not a call here.
 *
 * @implements FileScan<string>
 */
final readonly class StateEffectScan implements FileScan
{
    public const string STATE = 'App\\Stacks\\AgentState';

    /**
     * Method names that run, write, send or start, on any receiver.
     */
    private const array METHODS = [
        'run', 'runGuarded', 'dispatch', 'dispatchSync', 'dispatchNow', 'save', 'saveQuietly', 'update', 'create',
        'delete', 'forceDelete', 'insert', 'upsert', 'increment', 'decrement', 'push', 'pushOn', 'later', 'put',
        'append', 'prepend', 'store', 'storeAs', 'raise', 'start',
    ];

    /**
     * Functions that write files, start processes or send events.
     */
    private const array FUNCTIONS = [
        'file_put_contents', 'fwrite', 'unlink', 'rename', 'mkdir', 'rmdir', 'copy', 'touch', 'exec', 'shell_exec',
        'system', 'passthru', 'proc_open', 'popen', 'event', 'dispatch',
    ];

    public function key(): string
    {
        return 'state-effects-2';
    }

    public function findingsIn(ParsedFile $file): array
    {
        $findings = [];
        $finder = new NodeFinder();

        $inStates = str_contains($file->path, '/States/');

        foreach ($finder->find($file->statements, fn (Node $node) => self::isStatePart($node, $inStates)) as $type) {
            /** @var Stmt\Class_|Stmt\Trait_ $type */
            $name = self::identifier($type->name);

            foreach ($type->getMethods() as $method) {
                foreach ($finder->find($method->stmts ?? [], fn (Node $node) => self::isEffect($node)) as $call) {
                    $findings[] = sprintf('%d %s::%s %s', $call->getStartLine(), $name, $method->name, self::callOf($call));
                }
            }
        }

        return $findings;
    }

    /**
     * A class extending the base state, or a trait kept beside the states for them to share.
     */
    private static function isStatePart(Node $node, bool $isInStates): bool
    {
        if ($node instanceof Stmt\Trait_) {
            return $isInStates;
        }

        return $node instanceof Stmt\Class_ && $node->extends?->toString() === self::STATE;
    }

    private static function isEffect(Node $node): bool
    {
        if ($node instanceof Expr\FuncCall) {
            return $node->name instanceof Node\Name && in_array($node->name->toLowerString(), self::FUNCTIONS, true);
        }

        $isCall = $node instanceof Expr\MethodCall || $node instanceof Expr\NullsafeMethodCall
            || $node instanceof Expr\StaticCall;

        return $isCall && $node->name instanceof Node\Identifier && in_array($node->name->toString(), self::METHODS, true);
    }

    private static function callOf(Node $call): string
    {
        if ($call instanceof Expr\FuncCall && $call->name instanceof Node\Name) {
            return 'calls '.$call->name->toString();
        }

        /** @var Expr\MethodCall|Expr\NullsafeMethodCall|Expr\StaticCall $call */
        $class = $call instanceof Expr\StaticCall && $call->class instanceof Node\Name ? $call->class->toString().'::' : '';

        return 'calls '.$class.self::identifier($call->name);
    }

    private static function identifier(Expr|Node\Identifier $name): string
    {
        return $name instanceof Node\Identifier ? $name->toString() : '';
    }
}
