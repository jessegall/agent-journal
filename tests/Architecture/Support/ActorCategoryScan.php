<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use PhpParser\Node;
use PhpParser\Node\Expr\BinaryOp;
use PhpParser\Node\Expr\MethodCall;
use PhpParser\Node\Expr\NullsafeMethodCall;
use PhpParser\Node\Expr\StaticCall;
use PhpParser\Node\Identifier;
use PhpParser\Node\MatchArm;
use PhpParser\Node\Name;
use PhpParser\Node\Stmt\Case_;
use PhpParser\NodeFinder;

/**
 * Finds where code chooses behaviour by the kind of actor: an actor class's stored type compared or matched on, a call
 * of a removed identity-category helper, and a use of a removed role or actor attribute. Each finding is the file and
 * line with what was found.
 */
final class ActorCategoryScan
{
    /**
     * The helpers that once asked what kind of actor called.
     */
    private const array REMOVED_CALLS = ['requireUser', 'requireAgent', 'isJournalActor', 'isSignedIn', 'isMainAgent'];

    /**
     * The types that once carried a role or an actor requirement.
     */
    private const array REMOVED_NAMES = [
        'App\\Agents\\Enums\\AgentRole',
        'App\\Bus\\Attributes\\RequiresActor',
        'App\\Bus\\Attributes\\AllowsEngine',
    ];

    /**
     * @return list<string>
     */
    public static function findingsIn(ParsedFile $file): array
    {
        $finder = new NodeFinder();
        $findings = [];

        foreach ($finder->find($file->statements, self::choosesByActorType(...)) as $node) {
            $findings[] = self::at($file, $node, 'chooses behaviour by the stored type of an actor class');
        }

        foreach ($finder->find($file->statements, self::callsRemovedHelper(...)) as $node) {
            $findings[] = self::at($file, $node, 'calls a removed identity-category helper');
        }

        foreach ($finder->find($file->statements, self::namesRemovedType(...)) as $node) {
            $findings[] = self::at($file, $node, 'names a removed role or actor attribute');
        }

        return $findings;
    }

    private static function choosesByActorType(Node $node): bool
    {
        $isComparison = $node instanceof BinaryOp\Identical
            || $node instanceof BinaryOp\NotIdentical
            || $node instanceof BinaryOp\Equal
            || $node instanceof BinaryOp\NotEqual;

        if ($isComparison) {
            return self::isActorTypeCase($node->left) || self::isActorTypeCase($node->right);
        }

        if ($node instanceof MatchArm) {
            return array_any($node->conds ?? [], self::isActorTypeCase(...));
        }

        return $node instanceof Case_ && $node->cond !== null && self::isActorTypeCase($node->cond);
    }

    private static function isActorTypeCase(Node $node): bool
    {
        return $node instanceof StaticCall
            && $node->name instanceof Identifier
            && $node->name->toString() === 'storedType';
    }

    private static function callsRemovedHelper(Node $node): bool
    {
        $isCall = $node instanceof MethodCall || $node instanceof NullsafeMethodCall || $node instanceof StaticCall;

        return $isCall
            && $node->name instanceof Identifier
            && in_array($node->name->toString(), self::REMOVED_CALLS, true);
    }

    private static function namesRemovedType(Node $node): bool
    {
        return $node instanceof Name && in_array($node->toString(), self::REMOVED_NAMES, true);
    }

    private static function at(ParsedFile $file, Node $node, string $what): string
    {
        return "{$file->path}:{$node->getStartLine()} {$what}";
    }
}
