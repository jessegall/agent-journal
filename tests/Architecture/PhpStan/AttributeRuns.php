<?php

declare(strict_types=1);

namespace Tests\Architecture\PhpStan;

use PhpParser\Node;
use PhpParser\Node\AttributeGroup;
use PhpParser\NodeFinder;

/**
 * The runs of attributes in a file's syntax tree that must stand shortest first: two or more groups on one
 * declaration, each on its own line, with nothing but white space between them (user message 9262).
 */
final readonly class AttributeRuns
{
    public function __construct(private string $source) {}

    /**
     * Every run of two or more groups in the nodes, in the order the source writes them.
     *
     * @param  list<Node>  $nodes
     * @return list<list<AttributeGroup>>
     */
    public function in(array $nodes): array
    {
        $declarations = new NodeFinder()->find($nodes, fn (Node $node): bool => $this->standsInARun($node));

        return array_values(array_map(fn (Node $node): array => $this->groupsOf($node), $declarations));
    }

    /**
     * Whether the groups already stand shortest first; groups of the same length keep their order.
     *
     * @param  list<AttributeGroup>  $groups
     */
    public function isOrdered(array $groups): bool
    {
        return $this->ordered($groups) === $groups;
    }

    /**
     * The groups shortest first, those of the same length in the order they had.
     *
     * @param  list<AttributeGroup>  $groups
     * @return list<AttributeGroup>
     */
    public function ordered(array $groups): array
    {
        $ordered = $groups;
        usort($ordered, fn (AttributeGroup $first, AttributeGroup $second): int => $this->lengthOf($first)
            <=> $this->lengthOf($second));

        return $ordered;
    }

    /**
     * The group's text as the source writes it.
     */
    public function textOf(AttributeGroup $group): string
    {
        $start = $group->getStartFilePos();

        return substr($this->source, $start, $group->getEndFilePos() - $start + 1);
    }

    /**
     * The group's length as one line, its line breaks and their indentation left out.
     */
    private function lengthOf(AttributeGroup $group): int
    {
        return strlen((string) preg_replace('/\s*\R\s*/', '', $this->textOf($group)));
    }

    private function standsInARun(Node $node): bool
    {
        $groups = $this->groupsOf($node);

        if (count($groups) < 2) {
            return false;
        }

        foreach (array_slice($groups, 1) as $index => $group) {
            $before = $groups[$index];
            $between = substr(
                $this->source,
                $before->getEndFilePos() + 1,
                $group->getStartFilePos() - $before->getEndFilePos() - 1,
            );

            if (trim($between) !== '' || ! str_contains($between, "\n")) {
                return false;
            }
        }

        return true;
    }

    /**
     * @return list<AttributeGroup>
     */
    private function groupsOf(Node $node): array
    {
        if (! property_exists($node, 'attrGroups') || ! is_array($node->attrGroups)) {
            return [];
        }

        return array_values($node->attrGroups);
    }
}
