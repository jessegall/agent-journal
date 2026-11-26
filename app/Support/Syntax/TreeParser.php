<?php

declare(strict_types=1);

namespace App\Support\Syntax;

use App\Access\Values\ShellNode;
use App\Bus\Contracts\PipelineRunner;
use App\CommandRules\Enums\NodeType;
use App\Exceptions\ShellGrammarStopped;
use App\Pipelines\BuildShellTreePipeline;
use App\Processes\Enums\ShellDialect;
use App\Processes\Grammar\Values\SourceRange;
use App\Processes\Grammar\Values\TreeDiagnostic;
use App\Support\Lines\ShellLine;
use App\Values\ShellTree;

/**
 * Core's shell syntax: runs the line through the shell analysis pipeline. Invalid syntax or a limit keeps only a
 * diagnostic, never a partial tree. Every call opens its own draft, so it holds no request data.
 */
final readonly class TreeParser
{
    public function __construct(private PipelineRunner $pipelines) {}

    public function parse(string $line, ShellDialect $dialect): ShellTree
    {
        try {
            return $this->pipelines->run(
                BuildShellTreePipeline::class,
                new ShellLine($line, $dialect),
                ShellTree::class,
            );
        } catch (ShellGrammarStopped $stopped) {
            $root = new ShellNode(0, NodeType::Sequence, new SourceRange(0, strlen($line)), true, 0);

            return new ShellTree(
                $line,
                $dialect,
                $stopped->outcome,
                [0 => $root],
                0,
                new TreeDiagnostic($stopped->position, $stopped->reason),
            );
        }
    }
}
