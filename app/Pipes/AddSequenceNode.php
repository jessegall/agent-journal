<?php

declare(strict_types=1);

namespace App\Pipes;

use App\Contracts\Bus\Pipe;
use App\Enums\CommandRules\NodeType;
use App\Support\Grammar\GrammarContext;
use App\Support\Grammar\UnparsedList;
use App\Support\Lines\ScannedSource;
use App\Support\Syntax\TokenCursor;
use App\Values\SourceRange;

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
