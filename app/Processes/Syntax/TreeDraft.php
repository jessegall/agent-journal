<?php

declare(strict_types=1);

namespace App\Processes\Syntax;

use App\Processes\Enums\AnalysisLimit;
use App\Processes\Enums\NodeType;
use App\Processes\Enums\ParseOutcome;
use App\Processes\Enums\ShellDialect;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Values\Redirect;
use App\Processes\Values\ShellTree;
use App\Processes\Values\SourceRange;
use App\Processes\Values\TreeDiagnostic;
use App\Processes\Values\Word;

/**
 * The tree of one analysis while it is built: every line read for it, the whole line and each substitution inside it,
 * adds its nodes here. It counts the executable parts, keeps the first unsupported construct and the time budget, and
 * becomes the finished ShellTree. A new draft is made for every analysis, so nothing of one line reaches the next.
 */
final class TreeDraft
{
    /**
     * @var array<int, DraftNode>
     */
    private array $nodes = [];

    private int $nextId = 0;

    private int $executableParts = 0;

    private string|null $unsupportedReason = null;

    private int $unsupportedAt = 0;

    public function __construct(
        public readonly string $line,
        public readonly ShellDialect $dialect,
        private readonly TimeBudget $budget = new TimeBudget(),
    ) {}

    public function add(NodeType $type, SourceRange $range, int|null $parent): int
    {
        $id = $this->nextId++;
        $this->nodes[$id] = new DraftNode($type, $range, $parent ?? $id, $parent === null && $id === 0);

        if ($parent !== null) {
            $this->nodes[$parent]->children[] = $id;
        }

        return $id;
    }

    public function adopt(int $parent, int $child): void
    {
        $this->nodes[$child]->parent = $parent;
        $this->nodes[$parent]->children[] = $child;
    }

    public function remove(int $node): void
    {
        unset($this->nodes[$node]);
    }

    public function range(int $node): SourceRange
    {
        return $this->nodes[$node]->range;
    }

    public function hasChildren(int $node): bool
    {
        return $this->nodes[$node]->children !== [];
    }

    public function rangeTo(int $node, int $end): SourceRange
    {
        return new SourceRange($this->nodes[$node]->range->start, $end);
    }

    /**
     * @param  list<Word>  $words
     * @param  list<Redirect>  $redirects
     */
    public function finish(int $node, SourceRange $range, array $words, array $redirects): void
    {
        $this->nodes[$node]->range = $range;
        $this->nodes[$node]->words = $words;
        $this->nodes[$node]->redirects = $redirects;
    }

    /**
     * @param  list<Word>  $words
     */
    public function setWords(int $node, array $words): void
    {
        $this->nodes[$node]->words = $words;
    }

    /**
     * Turns a simple command the grammar does not support, such as set or shopt, into an Unsupported node that stays
     * in the tree and does not count as an executable part.
     */
    public function markStatementUnsupported(int $node, string $reason): void
    {
        $this->nodes[$node]->type = NodeType::Unsupported;
        $this->executableParts--;
        $this->markUnsupported($reason, $this->nodes[$node]->range->start);
    }

    /**
     * @throws ShellGrammarStopped
     */
    public function countExecutablePart(int $position): void
    {
        if (AnalysisLimit::ExecutableParts->isPassedBy(++$this->executableParts)) {
            throw ShellGrammarStopped::pastLimit(AnalysisLimit::ExecutableParts, $position);
        }
    }

    public function undoExecutablePartCount(): void
    {
        $this->executableParts--;
    }

    /**
     * Names the tree's outcome Unsupported by the first construct the grammar does not support.
     */
    public function markUnsupported(string $reason, int $position): void
    {
        if ($this->unsupportedReason === null) {
            $this->unsupportedReason = $reason;
            $this->unsupportedAt = $position;
        }
    }

    /**
     * @throws ShellGrammarStopped
     */
    public function assertWithinBudget(int $position): void
    {
        if ($this->budget->isSpent()) {
            throw ShellGrammarStopped::pastLimit(AnalysisLimit::Milliseconds, $position);
        }
    }

    public function tree(int $root): ShellTree
    {
        $nodes = [];

        foreach ($this->nodes as $id => $node) {
            $nodes[$id] = $node->finished($id);
        }
        $outcome = $this->unsupportedReason === null ? ParseOutcome::Complete : ParseOutcome::Unsupported;
        $diagnostic = $this->unsupportedReason === null ? null : new TreeDiagnostic(
            $this->unsupportedAt,
            $this->unsupportedReason,
        );

        return new ShellTree($this->line, $this->dialect, $outcome, $nodes, $root, $diagnostic);
    }
}
