<?php

declare(strict_types=1);

namespace App\Processes\Pipes\Grammar;

use App\Pipelines\Contracts\Pipe;
use App\Pipelines\Support\Pipelines;
use App\Processes\Enums\NodeType;
use App\Processes\Enums\RedirectType;
use App\Processes\Enums\TokenType;
use App\Processes\Exceptions\ShellGrammarStopped;
use App\Processes\Pipelines\ReadSubstitutionsPipeline;
use App\Processes\Stages\Grammar\RedirectReading;
use App\Processes\Stages\Grammar\SubstitutionsRead;
use App\Processes\Stages\Grammar\SubstitutionsReading;
use App\Processes\Syntax\TokenCursor;
use App\Processes\Values\HereDocument;
use App\Processes\Values\Redirect;
use App\Processes\Values\SourceRange;
use App\Processes\Values\Word;

/**
 * A redirect operator with its target word or here-document; the substitutions in either are read as children.
 */
final readonly class ReadRedirect implements Pipe
{
    public function __construct(private Pipelines $pipelines) {}

    /**
     * @throws ShellGrammarStopped
     */
    public function handle(RedirectReading $reading): Redirect
    {
        $cursor = $reading->cursor();
        $operator = $cursor->current();
        $cursor->advance();
        $type = $operator->redirect ?? RedirectType::Output;
        $operatorRange = $operator->range->shiftedBy($cursor->offset());
        if ($type === RedirectType::Close) {
            return new Redirect($operator->descriptor, $type, new Word([], $operatorRange), $operatorRange);
        }
        $start = $operatorRange->start;
        $target = $this->target($cursor, $start);
        $range = new SourceRange($start, $target->range->end);
        if ($type === RedirectType::HereDocument) {
            return new Redirect($operator->descriptor, $type, $this->hereDocument($reading, $start), $range);
        }
        $this->readSubstitutions($reading->substitutions($target, $reading->owner));

        return new Redirect($operator->descriptor, $type, $target, $range);
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
     * Takes the here-document body that waits for this redirect, and reads the substitutions in it.
     *
     * @throws ShellGrammarStopped
     */
    private function hereDocument(RedirectReading $reading, int $start): HereDocument
    {
        $cursor = $reading->cursor();
        $offset = $cursor->offset();
        $body = $cursor->takeHereDocumentBody()
            ?? throw ShellGrammarStopped::invalid('A here-document has no body.', $start);
        $node = $reading->draft()->add(NodeType::HereDocument, $body->range->shiftedBy($offset), $reading->owner);
        if ($body->word !== null) {
            $this->readSubstitutions($reading->substitutions($body->word->shiftedBy($offset), $node));
        }

        return $body->hereDocument
            ?? throw ShellGrammarStopped::invalid('A here-document has no body.', $start);
    }

    /**
     * @throws ShellGrammarStopped
     */
    private function readSubstitutions(SubstitutionsReading $reading): void
    {
        $this->pipelines->run(ReadSubstitutionsPipeline::class, $reading, SubstitutionsRead::class);
    }
}
