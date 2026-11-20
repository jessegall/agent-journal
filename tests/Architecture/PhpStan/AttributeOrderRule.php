<?php

declare(strict_types=1);

namespace Tests\Architecture\PhpStan;

use PhpParser\Node;
use PhpParser\Node\Stmt\ClassLike;
use PHPStan\Analyser\Scope;
use PHPStan\Rules\IdentifierRuleError;
use PHPStan\Rules\Rule;
use PHPStan\Rules\RuleErrorBuilder;

/**
 * The attributes stacked on a declaration stand shortest first, from the class down to its members and parameters
 * (user message 9262); tools/refactoring/sort-attributes.php puts them in order.
 *
 * @implements Rule<ClassLike>
 */
final class AttributeOrderRule implements Rule
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
        $runs = new AttributeRuns((string) file_get_contents($scope->getFile()));
        $unordered = array_filter($runs->in([$node]), fn (array $groups): bool => ! $runs->isOrdered($groups));

        return array_values(array_map(
            fn (array $groups) => RuleErrorBuilder::message(
                'Order the attributes shortest first: run tools/refactoring/sort-attributes.php on the file.',
            )
                ->identifier('attribute.order')
                ->line($groups[0]->getStartLine())
                ->build(),
            $unordered,
        ));
    }
}
