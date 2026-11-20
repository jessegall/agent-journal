<?php

declare(strict_types=1);

namespace Tests\Architecture\PhpStan;

use PhpParser\Node;
use PhpParser\Node\Param;
use PhpParser\Node\Stmt\ClassLike;
use PhpParser\Node\Stmt\Property;
use PHPStan\Analyser\Scope;
use PHPStan\Rules\IdentifierRuleError;
use PHPStan\Rules\Rule;
use PHPStan\Rules\RuleErrorBuilder;

/**
 * An attribute on a property or a promoted constructor parameter sits on its own line above it, never in front of it
 * on the same line (user message 9145). Pint moves a parameter's attributes in a multi-line signature; this rule
 * catches every other case.
 *
 * @implements Rule<ClassLike>
 */
final class StandaloneAttributeRule implements Rule
{
    public function getNodeType(): string
    {
        return ClassLike::class;
    }

    /**
     * @return list<IdentifierRuleError>
     */
    public function processNode(Node $node, Scope $scope): array
    {
        $constructor = $node->getMethod('__construct');
        $parameters = $constructor === null ? [] : $constructor->params;
        $promoted = array_filter($parameters, fn (Param $parameter) => $parameter->flags !== 0);
        $declarations = [...$node->getProperties(), ...$promoted];
        $inline = array_filter($declarations, fn (Property|Param $declaration) => self::isInline($declaration));

        return array_values(array_map(
            fn (Property|Param $declaration) => RuleErrorBuilder::message(
                'Put the attribute on its own line above the property it marks.',
            )
                ->identifier('attribute.sameLine')
                ->line($declaration->getStartLine())
                ->build(),
            $inline,
        ));
    }

    /**
     * Whether the last attribute ends on the line the declaration itself starts on: its type, or its name when it
     * has none.
     */
    private static function isInline(Property|Param $declaration): bool
    {
        $groups = $declaration->attrGroups;

        if ($groups === []) {
            return false;
        }

        $name = $declaration instanceof Property ? $declaration->props[0] : $declaration->var;
        $starts = $declaration->type === null
            ? $name->getStartLine()
            : min($declaration->type->getStartLine(), $name->getStartLine());

        return $groups[array_key_last($groups)]->getEndLine() === $starts;
    }
}
