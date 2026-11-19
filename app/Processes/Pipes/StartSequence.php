<?php

declare(strict_types=1);

namespace App\Processes\Pipes;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Enums\NodeType;
use App\Processes\Syntax\TokenCursor;
use App\Processes\Values\Grammar\GrammarContext;
use App\Processes\Values\Grammar\ListReading;
use App\Processes\Values\Lines\ScannedSource;
use App\Processes\Values\SourceRange;

/**
 * Opens the Sequence node of a scanned source and hands on the list to read into it.
 */
final readonly class StartSequence implements Pipe
{
    public function handle(ScannedSource $scanned): ListReading
    {
        $source = $scanned->source;
        $cursor = new TokenCursor($scanned->tokens, $source->offset);
        $range = new SourceRange($source->offset, $source->offset + strlen($source->text));
        $sequence = $source->draft->add(NodeType::Sequence, $range, $source->parent);

        return new ListReading(new GrammarContext($source, $cursor), $sequence, $source->depth, null);
    }
}
