<?php

declare(strict_types=1);

namespace App\Pipes\Lexing;

use App\Contracts\Bus\Pipe;
use App\Enums\TokenType;
use App\Enums\WordSegmentType;
use App\Exceptions\ShellLineUnreadable;
use App\Support\Syntax\LexerCursor;
use App\Support\Syntax\ShellExpansionScanner;
use App\Support\Syntax\Token;
use App\Values\HereDocument;
use App\Values\SourceRange;
use App\Values\Word;
use App\Values\WordSegment;

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

            $expansion = ($character === '`' || ($character === '$' && $cursor->at(
                $cursor->position + 1,
            ) === '(')) ? $this->expansions->read($cursor) : null;

            if ($expansion !== null) {
                $segments[] = $expansion;

                continue;
            }

            $cursor->position++;
        }

        return new Word($segments, $body);
    }
}
