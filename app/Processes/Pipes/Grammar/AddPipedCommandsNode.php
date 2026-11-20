<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Enums\NodeType;
use App\Processes\Syntax\TreeDraft;
use App\Processes\Values\Grammar\NodeRead;
use App\Processes\Values\Grammar\PipedCommands;
use App\Processes\Values\SourceRange;

/**
 * One command stands alone; several become a Pipeline node over all of them, and a ! before them a Negation over that.
 */
final readonly class AddPipedCommandsNode implements Pipe
{
    public function handle(PipedCommands $commands): NodeRead
    {
        $draft = $commands->draft();
        $pipeline = $this->pipelineOf($draft, $commands->commands);
        $negationStart = $commands->start->negationStart;

        if ($negationStart === null) {
            return new NodeRead($pipeline);
        }
        $range = new SourceRange($negationStart, $draft->range($pipeline)->end);
        $negation = $draft->add(NodeType::Negation, $range, null);
        $draft->adopt($negation, $pipeline);

        return new NodeRead($negation);
    }

    /**
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
}
