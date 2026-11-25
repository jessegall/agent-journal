<?php

declare(strict_types=1);

namespace App\Support\Syntax;

use App\Enums\NodeType;
use App\Enums\TokenType;
use App\Exceptions\ShellGrammarStopped;
use App\Support\Grammar\GrammarContext;
use App\Values\AgentText;
use App\Values\SourceRange;

/**
 * Shell constructs the grammar does not support (loops, conditionals, coprocesses, arithmetic commands, array
 * assignments): each is read past as one Unsupported node, and the first names the tree's outcome.
 */
final readonly class UnsupportedConstructs
{
    /**
     * Records the construct at the cursor as one Unsupported node, reading past its body.
     *
     * @throws ShellGrammarStopped
     */
    public function skip(GrammarContext $context, AgentText $reason, string|null $terminator): int
    {
        $cursor = $context->cursor;
        $start = $cursor->position();
        $end = $cursor->currentEnd();
        $opener = $cursor->currentLiteral();
        $construct = new UnsupportedConstruct($terminator);
        $cursor->advance();

        while (! $cursor->isAtEnd() && ! $construct->endsBefore($cursor->current())) {
            $end = $cursor->currentEnd();
            $construct->read($cursor->current());
            $cursor->advance();

            if ($construct->isClosed()) {
                $end = $this->endOfTrailingRedirects($context, $end);

                break;
            }
        }

        if ($construct->needsClosing()) {
            throw ShellGrammarStopped::invalid(
                AgentText::of('core.shell.not_closed_by', [
                    'opener' => $opener,
                    'terminator' => $terminator,
                ]),
                $start,
            );
        }

        $context->draft->markUnsupported($reason, $start);

        return $context->draft->add(NodeType::Unsupported, new SourceRange($start, $end), null);
    }

    /**
     * Reads past the redirects that follow a closed unsupported construct, and returns where the last one ends.
     */
    private function endOfTrailingRedirects(GrammarContext $context, int $end): int
    {
        $last = $end;
        $cursor = $context->cursor;

        while ($cursor->is(TokenType::Redirect)) {
            $cursor->advance();

            if ($cursor->is(TokenType::Word)) {
                $last = $cursor->currentEnd();
                $cursor->advance();
            }
        }

        return $last;
    }
}
