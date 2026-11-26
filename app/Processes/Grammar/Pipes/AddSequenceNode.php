<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes;

use App\Bus\Contracts\Pipe;
use App\CommandRules\Enums\NodeType;
use App\Processes\Grammar\GrammarContext;
use App\Processes\Grammar\Lines\ScannedSource;
use App\Processes\Grammar\UnparsedList;
use App\Processes\Grammar\Values\SourceRange;
use App\Support\Syntax\TokenCursor;

/**
 * Opens the Sequence node of a scanned source and hands on the list to read into it.
 */
final readonly class AddSequenceNode implements Pipe
{
    public function handle(ScannedSource $scanned): UnparsedList
    {
        $source = $scanned->source;
        $cursor = new TokenCursor($scanned->tokens, $source->offset);
        $range = new SourceRange($source->offset, $source->offset + strlen($source->text));
        $sequence = $source->draft->add(NodeType::Sequence, $range, $source->parent);

        return new UnparsedList(new GrammarContext($source, $cursor), $sequence, $source->depth, null);
    }
}
