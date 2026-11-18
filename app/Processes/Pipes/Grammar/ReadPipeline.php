<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Pipelines\Support\Pipelines;
use App\Processes\Enums\NodeType;
use App\Processes\Enums\TokenType;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Pipelines\ReadCommandPipeline;
use App\Processes\Syntax\TreeDraft;
use App\Processes\Values\Grammar\NodeRead;
use App\Processes\Values\Grammar\NodeReading;
use App\Processes\Values\SourceRange;

/**
 * pipeline := [!] command ((| | |&) command)*.
 */
final readonly class ReadPipeline implements Pipe
{
    public function __construct(private Pipelines $pipelines) {}

    /**
     * @throws ShellGrammarStopped
     */
    public function handle(NodeReading $reading): NodeRead
    {
        $cursor = $reading->cursor();
        $draft = $reading->draft();
        $negationStart = $cursor->is(TokenType::Bang) ? $cursor->position() : null;
        if ($negationStart !== null) {
            $cursor->advance();
        }
        $commands = [$this->command($reading)];
        while ($cursor->is(TokenType::Pipe) || $cursor->is(TokenType::PipeBoth)) {
            $cursor->advance();
            $cursor->skip(TokenType::Newline, TokenType::Comment);
            $commands[] = $this->command($reading);
        }
        $pipeline = $this->pipelineOf($draft, $commands);
        if ($negationStart === null) {
            return new NodeRead($pipeline);
        }

        return new NodeRead($this->negate($draft, $pipeline, $negationStart));
    }

    /**
     * @throws ShellGrammarStopped
     */
    private function command(NodeReading $reading): int
    {
        $command = $reading->command();

        return $this->pipelines->run(ReadCommandPipeline::class, $command, NodeRead::class)->node;
    }

    /**
     * One command stands alone; several become a Pipeline node over all of them.
     *
     * @param  non-empty-list<int>  $commands
     */
    private function pipelineOf(TreeDraft $draft, array $commands): int
    {
        if (count($commands) === 1) {
            return $commands[0];
        }
        $first = $draft->range($commands[0]);
        $last = $draft->range($commands[array_key_last($commands)]);
        $pipeline = $draft->add(NodeType::Pipeline, new SourceRange($first->start, $last->end), null);
        foreach ($commands as $command) {
            $draft->adopt($pipeline, $command);
        }

        return $pipeline;
    }

    private function negate(TreeDraft $draft, int $pipeline, int $start): int
    {
        $negation = $draft->add(NodeType::Negation, new SourceRange($start, $draft->range($pipeline)->end), null);
        $draft->adopt($negation, $pipeline);

        return $negation;
    }
}
