<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node\Expr\BinaryOp\Concat;
use PhpParser\Node\Expr\MethodCall;
use PhpParser\Node\Expr\StaticCall;
use PhpParser\Node\Expr\Variable;
use PhpParser\Node\Identifier;
use PhpParser\Node\Name;
use PhpParser\Node\Scalar\String_;
use PhpParser\NodeFinder;
use Tests\Support\ScanCache\FileScan;

/**
 * Rows read or written past their model (rule 25): a DB facade query or statement, or a connection's table().
 * Schema DDL through DB::statement('ALTER TABLE ...') and transaction control stay allowed.
 *
 * @implements FileScan<Violation>
 */
final readonly class RawRowAccess implements FileScan
{
    private const string DB = 'Illuminate\\Support\\Facades\\DB';

    /**
     * The DB facade methods that read or write rows.
     */
    private const array ROW_METHODS = [
        'table',
        'select',
        'selectone',
        'scalar',
        'cursor',
        'insert',
        'update',
        'delete',
        'statement',
        'unprepared',
        'affectingstatement',
        'query',
    ];

    public function key(): string
    {
        return 'raw-row-access-3';
    }

    public function findingsIn(ParsedFile $file): array
    {
        $finder = new NodeFinder();
        $violations = [];

        foreach ($finder->findInstanceOf($file->statements, StaticCall::class) as $call) {
            if ($call->name instanceof Identifier && $this->isRowQuery($call, $call->name)) {
                $violations[] = $this->violation($file, $call, 'DB::'.$call->name->toString().'()');
            }
        }

        foreach ($finder->findInstanceOf($file->statements, MethodCall::class) as $call) {
            $isCallOnThis = $call->var instanceof Variable && $call->var->name === 'this';

            if ($call->name instanceof Identifier && $call->name->toLowerString() === 'table' && ! $isCallOnThis) {
                $violations[] = $this->violation($file, $call, '->table()');
            }
        }

        return $violations;
    }

    private function isRowQuery(StaticCall $call, Identifier $name): bool
    {
        if (! $call->class instanceof Name || $call->class->toString() !== self::DB) {
            return false;
        }

        $method = $name->toLowerString();

        return in_array($method, self::ROW_METHODS, true) && ! ($method === 'statement' && $this->changesSchema($call));
    }

    /**
     * A statement whose SQL text alters or creates a schema object, such as a check constraint.
     */
    private function changesSchema(StaticCall $call): bool
    {
        $sql = $call->getArgs()[0]->value ?? null;

        while ($sql instanceof Concat) {
            $sql = $sql->left;
        }

        return $sql instanceof String_ && preg_match('/^\\s*(ALTER|CREATE|DROP) /i', $sql->value) === 1;
    }

    private function violation(ParsedFile $file, MethodCall|StaticCall $call, string $rowAccessExpression): Violation
    {
        return new Violation(
            $file->path,
            $call->getStartLine(),
            $rowAccessExpression,
            'none',
            'none',
            ViolationType::RawRowAccess,
        );
    }
}
