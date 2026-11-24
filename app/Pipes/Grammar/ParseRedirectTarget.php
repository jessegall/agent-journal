<?php

declare(strict_types=1);

namespace App\Pipes\Grammar;

use App\Contracts\Bus\Pipe;
use App\Enums\NodeType;
use App\Enums\RedirectType;
use App\Enums\TokenType;
use App\Exceptions\ShellGrammarStopped;
use App\Support\Grammar\RedirectParts;
use App\Support\Grammar\RedirectToParse;
use App\Support\Syntax\TokenCursor;
use App\Values\AgentText;
use App\Values\Redirect;
use App\Values\SourceRange;
use App\Values\Word;

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
        $noTarget = AgentText::of('core.shell.redirect_without_target');

        if (! $cursor->is(TokenType::Word)) {
            throw ShellGrammarStopped::invalid($noTarget, $start);
        }

        $target = $cursor->word($noTarget);
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
        $noBody = AgentText::of('core.shell.heredoc_without_body');

        $body = $cursor->takeHereDocumentBody()
            ?? throw ShellGrammarStopped::invalid($noBody, $range->start);

        $node = $toParse->draft()->add(NodeType::HereDocument, $body->range->shiftedBy($offset), $toParse->owner);

        $hereDocument = $body->hereDocument
            ?? throw ShellGrammarStopped::invalid($noBody, $range->start);

        $redirect = new Redirect($descriptor, RedirectType::HereDocument, $hereDocument, $range);

        if ($body->word === null) {
            return new RedirectParts($redirect, $toParse->nothingToRead($range));
        }

        return new RedirectParts($redirect, $toParse->substitutions($body->word->shiftedBy($offset), $node));
    }
}
