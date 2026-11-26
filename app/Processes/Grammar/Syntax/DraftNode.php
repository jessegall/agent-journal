<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Syntax;

use App\Access\Values\ShellNode;
use App\CommandRules\Enums\NodeType;
use App\Processes\Grammar\Values\SourceRange;
use App\Values\Redirect;
use App\Values\Word;

/**
 * One node of a tree draft while the grammar still changes it: its range grows as words are read, and it gains its
 * children, words and redirects; it becomes a ShellNode when the draft is finished.
 */
final class DraftNode
{
    /**
     * @var list<int>
     */
    public array $children = [];

    /**
     * @var list<Word>
     */
    public array $words = [];

    /**
     * @var list<Redirect>
     */
    public array $redirects = [];

    public function __construct(
        public NodeType $type,
        public SourceRange $range,
        public int $parent,
        public readonly bool $isRoot,
    ) {}

    public function finished(int $id): ShellNode
    {
        return new ShellNode(
            $id,
            $this->type,
            $this->range,
            $this->isRoot,
            $this->parent,
            $this->children,
            $this->words,
            $this->redirects,
        );
    }
}
