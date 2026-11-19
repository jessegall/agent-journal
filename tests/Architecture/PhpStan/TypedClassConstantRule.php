<?php

declare(strict_types=1);

namespace Tests\Architecture\PhpStan;

use PhpParser\Node;
use PhpParser\Node\Stmt\ClassConst;
use PHPStan\Analyser\Scope;
use PHPStan\Rules\IdentifierRuleError;
use PHPStan\Rules\Rule;
use PHPStan\Rules\RuleErrorBuilder;

/**
 * Every class constant declares its type (PHP 8.3 and later): `public const string NAME = 'x';`, never `const NAME`.
 *
 * @implements Rule<ClassConst>
 */
final class TypedClassConstantRule implements Rule
{
    public function getNodeType(): string
    {
        return ClassConst::class;
    }

    /**
     * @return list<IdentifierRuleError>
     */
    public function processNode(Node $node, Scope $scope): array
    {
        if ($node->type !== null) {
            return [];
        }

        return array_map(
            fn (Node\Const_ $constant) => RuleErrorBuilder::message(
                "Class constant {$constant->name->toString()} has no type; write it as const <type> "
                    ."{$constant->name->toString()}.",
            )
                ->identifier('classConstant.untyped')
                ->line($node->getStartLine())
                ->build(),
            array_values($node->consts),
        );
    }
}
