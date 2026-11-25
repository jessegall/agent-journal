<?php

declare(strict_types=1);

namespace Tests\Architecture\PhpStan;

use App\Support\ActorReference;
use PhpParser\Node;
use PhpParser\Node\Expr\StaticCall;
use PhpParser\Node\Identifier;
use PhpParser\Node\Name;
use PHPStan\Analyser\Scope;
use PHPStan\Rules\IdentifierRuleError;
use PHPStan\Rules\Rule;
use PHPStan\Rules\RuleErrorBuilder;
use PHPStan\Type\ObjectType;

/**
 * ActorReference::of is given an actor, never a reference: a reference passed to it only comes back as a copy of
 * itself, so the reference is used as it is.
 *
 * @implements Rule<StaticCall>
 */
final class ActorReferenceCopyRule implements Rule
{
    public function getNodeType(): string
    {
        return StaticCall::class;
    }

    /**
     * @return list<IdentifierRuleError>
     */
    public function processNode(Node $node, Scope $scope): array
    {
        $isReferenceOf = $node->class instanceof Name
            && $scope->resolveName($node->class) === ActorReference::class
            && $node->name instanceof Identifier
            && $node->name->toString() === 'of';

        if (! $isReferenceOf || $node->getArgs() === []) {
            return [];
        }

        $given = $scope->getType($node->getArgs()[0]->value);

        if (! new ObjectType(ActorReference::class)->isSuperTypeOf($given)->yes()) {
            return [];
        }

        return [
            RuleErrorBuilder::message('ActorReference::of is given an ActorReference; use the reference as it is.')
                ->identifier('actorReference.copied')
                ->build(),
        ];
    }
}
