<?php

declare(strict_types=1);

namespace App\Processes\Values\Lines;

use App\Processes\Syntax\TreeDraft;

/**
 * Text to be read as shell: the whole line, or the inside of a substitution, with the byte where it starts in the whole
 * line, how deep it is nested, the node its sequence hangs under and the draft every reading of this analysis adds to.
 */
final readonly class ShellSource
{
    public function __construct(
        public string $text,
        public int $offset,
        public int $depth,
        public int|null $parent,
        public TreeDraft $draft,
    ) {}

    /**
     * The inside of a substitution of this source, read one level deeper under its substitution node.
     */
    public function inner(string $text, int $offset, int $depth, int $parent): self
    {
        return new self($text, $offset, $depth, $parent, $this->draft);
    }
}
