<?php

declare(strict_types=1);

namespace App\Processes\Pipes;

use App\Pipelines\Contracts\Pipe;
use App\Pipelines\Support\Pipelines;
use App\Processes\Enums\NodeType;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Pipelines\ReadListPipeline;
use App\Processes\Syntax\TokenCursor;
use App\Processes\Values\Grammar\GrammarContext;
use App\Processes\Values\Grammar\ListRead;
use App\Processes\Values\Grammar\ListReading;
use App\Processes\Values\Lines\ReadSource;
use App\Processes\Values\Lines\ScannedSource;
use App\Processes\Values\SourceRange;

/**
 * Reads a scanned source into the draft as a Sequence node through the shell grammar's nested pipelines (doc 21
 * revision 3, section 5): the list pipeline reads and-or chains, they read pipelines, those read commands, and a
 * subshell or group runs the list pipeline again; each substitution runs the whole line pipeline again.
 */
final readonly class BuildTree implements Pipe
{
    public function __construct(private Pipelines $pipelines) {}

    /**
     * @throws ShellGrammarStopped
     */
    public function handle(ScannedSource $scanned): ReadSource
    {
        $source = $scanned->source;
        $cursor = new TokenCursor($scanned->tokens, $source->offset);
        $range = new SourceRange($source->offset, $source->offset + strlen($source->text));
        $sequence = $source->draft->add(NodeType::Sequence, $range, $source->parent);
        $list = new ListReading(new GrammarContext($source, $cursor), $sequence, $source->depth, null);
        $this->pipelines->run(ReadListPipeline::class, $list, ListRead::class);
        if (! $cursor->atEnd()) {
            throw ShellGrammarStopped::invalid("Unexpected {$cursor->currentType()->value}.", $cursor->position());
        }

        return new ReadSource($source, $sequence);
    }
}
