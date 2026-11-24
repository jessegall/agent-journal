<?php

declare(strict_types=1);

namespace App\Support\Syntax;

use App\Contracts\Bus\PipelineRunner;
use App\Enums\NodeType;
use App\Enums\ShellDialect;
use App\Exceptions\ShellGrammarStopped;
use App\Pipelines\BuildShellTreePipeline;
use App\Support\Lines\ShellLine;
use App\Values\ShellNode;
use App\Values\ShellTree;
use App\Values\SourceRange;
use App\Values\TreeDiagnostic;

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
