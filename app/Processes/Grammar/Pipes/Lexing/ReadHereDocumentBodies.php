<?php

declare(strict_types=1);

namespace App\Processes\Grammar\Pipes\Lexing;

use App\Bus\Contracts\Pipe;
use App\CommandRules\Enums\TokenType;
use App\CommandRules\Enums\WordSegmentType;
use App\Processes\Grammar\Exceptions\ShellLineUnreadable;
use App\Processes\Grammar\Syntax\LexerCursor;
use App\Processes\Grammar\Syntax\ShellExpansionScanner;
use App\Processes\Grammar\Syntax\Token;
use App\Processes\Grammar\Values\SourceRange;
use App\Processes\Grammar\Values\WordSegment;
use App\Processes\Values\HereDocument;
use App\Values\Word;

/**
 * Reads every body waiting after its delimiter word, in operator order.
 */
final readonly class ReadHereDocumentBodies implements Pipe
{
    public function __construct(private ShellExpansionScanner $expansions) {}

    /**
     * Reads the bodies of the here-documents named on the line just ended, in order, each up to its delimiter line.
     *
     * @throws ShellLineUnreadable
     */
    public function handle(LexerCursor $cursor): LexerCursor
    {
        if (! $cursor->hereDocuments->hasWaiting()) {
            return $cursor;
        }

        $tokens = $cursor->tokens();

        foreach ($cursor->hereDocuments->takeWaiting() as $waiting) {
            $redirectIndex = $waiting->redirect;
            $stripsTabs = $waiting->stripsTabs;

            $delimiterWord = $tokens[$redirectIndex + 1]->word ?? throw ShellLineUnreadable::unfinished(
                'a here-document without a delimiter',
                $tokens[$redirectIndex]->range->start,
            );

            $isQuoted = array_any(
                $delimiterWord->segments,
                fn (WordSegment $segment) => $segment->type !== WordSegmentType::Literal,
            );

            $delimiter = implode('', array_map(fn (WordSegment $segment) => $segment->text, $delimiterWord->segments));

            $bodyStart = $cursor->position;
            $lineStart = $cursor->position;
            $found = false;
            $bodyEnd = $lineStart;
            $length = strlen($cursor->source);

            while ($lineStart <= $length) {
                $cursor->assertWithinBudget();
                $lineEnd = strpos($cursor->source, "\n", $lineStart);
                $lineEnd = $lineEnd === false ? $length : $lineEnd;
                $line = substr($cursor->source, $lineStart, $lineEnd - $lineStart);

                if (($stripsTabs ? ltrim($line, "\t") : $line) === $delimiter) {
                    $found = true;
                    $bodyEnd = $lineStart;
                    $cursor->position = min($lineEnd + 1, $length);

                    break;
                }

                if ($lineEnd === $length) {
                    break;
                }

                $lineStart = $lineEnd + 1;
            }

            if (! $found) {
                throw ShellLineUnreadable::unfinished(
                    "the here-document ended by {$delimiter}",
                    $tokens[$redirectIndex]->range->start,
                );
            }

            $body = new SourceRange($bodyStart, $bodyEnd);

            $cursor->append(new Token(
                TokenType::HereDocumentBody,
                $body,
                word: $isQuoted ? null : $this->substitutionsIn($cursor->fork(), $body),
                hereDocument: new HereDocument($delimiter, $isQuoted, $stripsTabs, $body),
            ));
        }

        return $cursor;
    }

    /**
     * Reads substitutions on a fork so the main cursor keeps its place after the delimiter.
     */
    private function substitutionsIn(LexerCursor $cursor, SourceRange $body): Word
    {
        $segments = [];
        $cursor->position = $body->start;

        while ($cursor->position < $body->end) {
            $character = $cursor->source[$cursor->position];

            if ($character === '\\') {
                $cursor->position += 2;

                continue;
            }

            $expansion = $this->substitutionAt($cursor, $character);

            if ($expansion !== null) {
                $segments[] = $expansion;

                continue;
            }

            $cursor->position++;
        }

        return new Word($segments, $body);
    }

    /**
     * The command substitution a here-document body holds at the cursor; none where the character starts none.
     *
     * @throws ShellLineUnreadable
     */
    private function substitutionAt(LexerCursor $cursor, string $character): WordSegment|null
    {
        if ($character !== '`' && ($character !== '$' || $cursor->at($cursor->position + 1) !== '(')) {
            return null;
        }

        return $this->expansions->read($cursor);
    }
}
