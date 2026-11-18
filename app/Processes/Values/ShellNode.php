<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\NodeType;

/**
 * One node of a shell syntax tree: its id within the tree, what it is, where it sits in the source, its parent and its
 * children in order. The root has no parent and says so with isRoot; a simple command keeps its words and redirects.
 */
final readonly class ShellNode
{
    /**
     * @param  list<int>  $children
     * @param  list<Word>  $words
     * @param  list<Redirect>  $redirects
     */
    public function __construct(
        public int $id,
        public NodeType $type,
        public SourceRange $range,
        public bool $isRoot,
        public int $parent,
        public array $children = [],
        public array $words = [],
        public array $redirects = [],
    ) {}
}
