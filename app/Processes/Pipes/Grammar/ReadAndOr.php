<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Pipelines\Support\Pipelines;
use App\Processes\Enums\NodeType;
use App\Processes\Enums\TokenType;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Pipelines\ReadPipelinePipeline;
use App\Processes\Syntax\TreeDraft;
use App\Processes\Values\Grammar\NodeRead;
use App\Processes\Values\Grammar\NodeReading;
use App\Processes\Values\SourceRange;

/**
 * and_or := pipeline ((&& | ||) pipeline)*, joined from the left.
 */
final readonly class ReadAndOr implements Pipe
{
    public function __construct(private Pipelines $pipelines) {}

    /**
     * @throws ShellGrammarStopped
     */
    public function handle(NodeReading $reading): NodeRead
    {
        $cursor = $reading->cursor();
        $left = $this->pipeline($reading);
        while ($cursor->is(TokenType::AndIf) || $cursor->is(TokenType::OrIf)) {
            $type = $cursor->is(TokenType::AndIf) ? NodeType::AndList : NodeType::OrList;
            $cursor->advance();
            $cursor->skip(TokenType::Newline, TokenType::Comment);
            $left = $this->chain($reading->draft(), $type, $left, $this->pipeline($reading));
        }

        return new NodeRead($left);
    }

    /**
     * @throws ShellGrammarStopped
     */
    private function pipeline(NodeReading $reading): int
    {
        return $this->pipelines->run(ReadPipelinePipeline::class, $reading, NodeRead::class)->node;
    }

    private function chain(TreeDraft $draft, NodeType $type, int $left, int $right): int
    {
        $range = new SourceRange($draft->range($left)->start, $draft->range($right)->end);
        $joined = $draft->add($type, $range, null);
        $draft->adopt($joined, $left);
        $draft->adopt($joined, $right);

        return $joined;
    }
}
