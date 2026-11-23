<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node;
use PhpParser\Node\Expr;
use PhpParser\Node\Scalar\String_;
use PhpParser\Node\Stmt;
use PhpParser\NodeFinder;
use Tests\Support\ScanCache\FileScan;

/**
 * The writes of an assignment's holder and record fields and a claim authorization's fields in a file that names
 * those models, and the assignment writers a state names, each with its line.
 *
 * @implements FileScan<string>
 */
final readonly class AssignmentWriteScan implements FileScan
{
    public const array MODELS = [
        'App\\Models\\Records\\AssignmentRecord',
        'App\\Models\\Records\\ClaimAuthorization',
    ];

    /**
     * The fields only the models and their writers set.
     */
    public const array FIELDS = [
        'record_type', 'record_id', 'holder_type', 'holder_id', 'claim_assignment_id', 'basis_type',
        'participation_assignment_id', 'work_assignment_id',
    ];

    /**
     * The calls that set fields from an array or by name.
     */
    private const array SETTERS = ['update', 'fill', 'forceFill', 'setAttribute', 'setRawAttributes', 'create'];

    public function key(): string
    {
        return 'assignment-writes-2';
    }

    public function findingsIn(ParsedFile $file): array
    {
        $finder = new NodeFinder();
        $findings = [];
        $isState = $finder->findFirst(
            $file->statements,
            fn (Node $node) => $node instanceof Stmt\Class_ && $node->extends?->toString() === StateEffectScan::STATE,
        ) !== null;

        if ($isState) {
            foreach ($finder->find($file->statements, fn (Node $node) => self::isAssignmentType($node)) as $name) {
                /** @var Node\Name $name */
                $findings[] = $name->getStartLine().' state names '.$name->toString();
            }
        }

        $namesModel = $finder->findFirst(
            $file->statements,
            fn (Node $node) => $node instanceof Node\Name && in_array($node->toString(), self::MODELS, true),
        ) !== null;

        if (! $namesModel) {
            return $findings;
        }

        foreach ($finder->find($file->statements, fn (Node $node) => self::writesField($node)) as $write) {
            $findings[] = $write->getStartLine().' writes '.self::fieldOf($write);
        }

        return $findings;
    }

    private static function isAssignmentType(Node $node): bool
    {
        return $node instanceof Node\Name && FormerPaths::classWasIn($node->toString(), ['app/Assignments/'])
            && ! $node->getAttribute('parent') instanceof Node\UseItem;
    }

    private static function writesField(Node $node): bool
    {
        if ($node instanceof Expr\Assign && $node->var instanceof Expr\PropertyFetch) {
            return $node->var->name instanceof Node\Identifier && in_array(self::identifier($node->var->name), self::FIELDS, true);
        }

        if (! $node instanceof Expr\ArrayItem || ! $node->key instanceof String_) {
            return false;
        }

        $call = $node->getAttribute('parent')?->getAttribute('parent')?->getAttribute('parent');

        return in_array($node->key->value, self::FIELDS, true)
            && ($call instanceof Expr\MethodCall || $call instanceof Expr\StaticCall)
            && $call->name instanceof Node\Identifier && in_array(self::identifier($call->name), self::SETTERS, true);
    }

    private static function fieldOf(Node $write): string
    {
        if ($write instanceof Expr\Assign && $write->var instanceof Expr\PropertyFetch) {
            return self::identifier($write->var->name);
        }

        /** @var Expr\ArrayItem $write */
        /** @var String_ $key */
        $key = $write->key;

        return $key->value;
    }

    private static function identifier(Expr|Node\Identifier $name): string
    {
        return $name instanceof Node\Identifier ? $name->toString() : '';
    }
}
