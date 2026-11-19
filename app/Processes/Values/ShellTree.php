<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\ParseOutcome;
use App\Processes\Enums\ShellDialect;
use App\Processes\Exceptions\ShellNodeMissing;

/**
 * A shell line read as a tree: the unchanged source, its dialect and outcome, every node by id from the root, and
 * a diagnostic when the line was invalid, unsupported or past a limit.
 */
final readonly class ShellTree
{
    /**
     * @param  array<int, ShellNode>  $nodes  by node id
     */
    public function __construct(
        public string $source,
        public ShellDialect $dialect,
        public ParseOutcome $outcome,
        public array $nodes,
        public int $root,
        public TreeDiagnostic|null $diagnostic = null,
    ) {}

    /**
     * The source text a range covers.
     */
    public function textOf(SourceRange $range): string
    {
        return substr($this->source, $range->start, max(0, $range->end - $range->start));
    }

    /**
     * A node's own source with its redirects taken out and its spaces collapsed, as the command to run instead.
     */
    public function withoutRedirects(ShellNode $node): string
    {
        $text = '';
        $at = $node->range->start;
        foreach ($node->redirects as $redirect) {
            $text .= $this->textOf(new SourceRange($at, $redirect->range->start));
            $at = $redirect->range->end;
        }
        $text .= $this->textOf(new SourceRange($at, $node->range->end));

        return trim((string) preg_replace('/\s+/', ' ', $text));
    }

    /**
     * @throws ShellNodeMissing
     */
    public function node(int $id): ShellNode
    {
        return $this->nodes[$id] ?? throw ShellNodeMissing::withId($id);
    }

    /**
     * @return list<ShellNode>
     */
    public function children(int $id): array
    {
        return array_map($this->node(...), $this->node($id)->children);
    }

    /**
     * The simple commands of the line in the order they are shown, depth first from the root, nested substitutions
     * and wrapped commands included.
     *
     * @return list<ShellNode>
     */
    public function executableParts(): array
    {
        $parts = [];
        $pending = [$this->root];
        while ($pending !== []) {
            $node = $this->node(array_shift($pending));
            if ($node->type->isExecutable()) {
                $parts[] = $node;
            }
            array_unshift($pending, ...$node->children);
        }

        return $parts;
    }

    /**
     * Every redirect of the line, in source order.
     *
     * @return list<Redirect>
     */
    public function redirects(): array
    {
        $redirects = $this->nodes
                |> array_values(...)
                |> (fn ($x) => array_map(fn (ShellNode $node) => $node->redirects, $x))
                |> (fn ($x) => array_merge(...$x));

        usort($redirects, fn (Redirect $first, Redirect $second) => $first->range->start <=> $second->range->start);

        return $redirects;
    }
}
