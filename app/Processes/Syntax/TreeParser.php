<?php

declare(strict_types=1);

namespace App\Processes\Syntax;

use App\Pipelines\Support\Pipelines;
use App\Processes\Contracts\ShellSyntax;
use App\Processes\Enums\NodeType;
use App\Processes\Enums\ShellDialect;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Pipelines\ShellAnalysisPipeline;
use App\Processes\Stages\ShellLine;
use App\Processes\Values\ShellNode;
use App\Processes\Values\ShellTree;
use App\Processes\Values\SourceRange;
use App\Processes\Values\TreeDiagnostic;

/**
 * Core's shell syntax: runs the line through the shell analysis pipeline. Invalid syntax or a limit keeps only a
 * diagnostic, never a partial tree. Every call opens its own draft, so it holds no request data.
 */
final readonly class TreeParser implements ShellSyntax
{
    public function __construct(private Pipelines $pipelines) {}

    public function parse(string $line, ShellDialect $dialect): ShellTree
    {
        try {
            return $this->pipelines->run(ShellAnalysisPipeline::class, new ShellLine($line, $dialect), ShellTree::class);
        } catch (ShellGrammarStopped $stopped) {
            $root = new ShellNode(0, NodeType::Sequence, new SourceRange(0, strlen($line)), true, 0);

            return new ShellTree($line, $dialect, $stopped->outcome, [0 => $root], 0, new TreeDiagnostic($stopped->position, $stopped->getMessage()));
        }
    }
}
