<?php

declare(strict_types=1);

namespace App\Support\Syntax;

use App\CommandRules\Enums\WordSegmentType;
use App\Processes\Grammar\Values\SourceRange;
use App\Processes\Grammar\Values\WordSegment;
use App\Values\Word;

/**
 * Gathers one word while the lexer reads it: plain characters run together into a Literal segment, which ends where a
 * quoted, escaped or expanded segment begins.
 */
final class WordBuilder
{
    /**
     * @var list<WordSegment>
     */
    private array $segments = [];

    private string|null $literal = null;

    private int $literalStart = 0;

    public function addCharacter(string $character, int $position): void
    {
        if ($this->literal === null) {
            $this->literalStart = $position;
        }

        $this->literal .= $character;
    }

    /**
     * Ends the plain text gathered so far at the position, then adds the segments.
     */
    public function add(int $position, WordSegment ...$segments): void
    {
        $this->endLiteral($position);
        array_push($this->segments, ...$segments);
    }

    public function word(SourceRange $range): Word
    {
        $this->endLiteral($range->end);

        return new Word($this->segments, $range);
    }

    private function endLiteral(int $position): void
    {
        if ($this->literal !== null) {
            $this->segments[] = new WordSegment(
                WordSegmentType::Literal,
                $this->literal,
                new SourceRange($this->literalStart, $position),
            );
        }

        $this->literal = null;
    }
}
