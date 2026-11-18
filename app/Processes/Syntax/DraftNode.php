<?php

declare(strict_types=1);

namespace App\Processes\Syntax;

use App\Processes\Enums\NodeType;
use App\Processes\Values\Redirect;
use App\Processes\Values\ShellNode;
use App\Processes\Values\SourceRange;
use App\Processes\Values\Word;

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
        return new ShellNode($id, $this->type, $this->range, $this->isRoot, $this->parent, $this->children, $this->words, $this->redirects);
    }
}
