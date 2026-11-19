<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Processes\Enums\NodeType;
use App\Processes\Enums\RedirectType;
use App\Processes\Enums\TokenType;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Syntax\TokenCursor;
use App\Processes\Values\Grammar\RedirectParts;
use App\Processes\Values\Grammar\RedirectToParse;
use App\Processes\Values\Redirect;
use App\Processes\Values\SourceRange;
use App\Processes\Values\Word;

/**
 * A redirect operator with its target word or here-document, and the word whose substitutions are read as children:
 * the target's, the here-document body's, or none for a close.
 */
final readonly class ParseRedirectTarget implements Pipe
{
    /**
     * @throws ShellGrammarStopped
     */
    public function handle(RedirectToParse $toParse): RedirectParts
    {
        $cursor = $toParse->cursor();
        $operator = $cursor->current();
        $cursor->advance();
        $type = $operator->redirect ?? RedirectType::Output;
        $operatorRange = $operator->range->shiftedBy($cursor->offset());
        if ($type === RedirectType::Close) {
            $redirect = new Redirect($operator->descriptor, $type, new Word([], $operatorRange), $operatorRange);

            return new RedirectParts($redirect, $toParse->nothingToRead($operatorRange));
        }
        $start = $operatorRange->start;
        $target = $this->target($cursor, $start);
        $range = new SourceRange($start, $target->range->end);
        if ($type === RedirectType::HereDocument) {
            return $this->hereDocument($toParse, $operator->descriptor, $range);
        }
        $redirect = new Redirect($operator->descriptor, $type, $target, $range);

        return new RedirectParts($redirect, $toParse->substitutions($target, $toParse->owner));
    }

    /**
     * @throws ShellGrammarStopped
     */
    private function target(TokenCursor $cursor, int $start): Word
    {
        if (! $cursor->is(TokenType::Word)) {
            throw ShellGrammarStopped::invalid('A redirect has no target.', $start);
        }
        $target = $cursor->word('A redirect has no target.');
        $cursor->advance();

        return $target;
    }

    /**
     * Takes the here-document body that waits for this redirect, as a node whose children are its substitutions.
     *
     * @throws ShellGrammarStopped
     */
    private function hereDocument(RedirectToParse $toParse, int $descriptor, SourceRange $range): RedirectParts
    {
        $cursor = $toParse->cursor();
        $offset = $cursor->offset();
        $body = $cursor->takeHereDocumentBody()
            ?? throw ShellGrammarStopped::invalid('A here-document has no body.', $range->start);
        $node = $toParse->draft()->add(NodeType::HereDocument, $body->range->shiftedBy($offset), $toParse->owner);
        $hereDocument = $body->hereDocument
            ?? throw ShellGrammarStopped::invalid('A here-document has no body.', $range->start);
        $redirect = new Redirect($descriptor, RedirectType::HereDocument, $hereDocument, $range);
        if ($body->word === null) {
            return new RedirectParts($redirect, $toParse->nothingToRead($range));
        }

        return new RedirectParts($redirect, $toParse->substitutions($body->word->shiftedBy($offset), $node));
    }
}
