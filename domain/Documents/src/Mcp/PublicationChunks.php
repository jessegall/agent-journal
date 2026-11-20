<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp;

use App\Mcp\Data\ToolResult;
use App\Mcp\Exceptions\ToolArgumentInvalid;
use App\Mcp\Support\Continuation;
use App\Mcp\Contracts\Continuations;
use App\Mcp\Support\TextChunk;
use App\Mcp\Support\ToolArguments;
use App\Text\Support\MarkdownText;

final readonly class PublicationChunks
{
    private const int ESCAPED_CHUNK_BYTES = 900;

    public function __construct(private Continuations $continuations) {}

    public function range(Continuation $read, MarkdownText $body, ToolArguments $arguments): Continuation
    {
        $section = $arguments->optionalText('section');
        $first = $arguments->optionalWholeNumber('line_start');
        $last = $arguments->optionalWholeNumber('line_end');
        $offset = $arguments->optionalWholeNumber('character_offset');

        if ($section !== null && ($first !== null || $last !== null || $offset !== null)) {
            throw ToolArgumentInvalid::for('section', 'a section without line or character arguments');
        }

        if ($offset !== null && ($first === null || ($last !== null && $last !== $first))) {
            throw ToolArgumentInvalid::for('character_offset', 'a character offset on one explicitly selected line');
        }
        if ($offset !== null) {
            $last = $first;
        }

        if ($section !== null) {
            $selected = $body->sectionBy($section);
            $first = $selected->firstLine;
            $last = $selected->lastLine;
        }

        return new Continuation(
            $read->tool,
            $read->selector,
            [...$read->filters, 'line_end' => $last],
            $first ?? 1,
            $offset ?? 0,
            $read->revision,
        );
    }

    /**
     * @param array<string, mixed> $card
     */
    public function page(string $text, Continuation $read, string $selectorName, array $card): ToolResult
    {
        $chunk = $this->chunk($text, $read);
        $next = $chunk->hasMore ? [$this->continuations->link(new Continuation(
            $read->tool,
            $read->selector,
            $read->filters,
            $chunk->nextLine,
            $chunk->nextCharacter,
            $read->revision,
        ), $selectorName)] : [];

        return ToolResult::ok([
            ...$card,
            'body' => $chunk->text,
            'line_start' => $chunk->lineStart,
            'line_end' => $chunk->nextCharacter > 0 ? $chunk->nextLine : $chunk->nextLine - 1,
            'character_offset' => $chunk->characterStart,
        ], $next);
    }

    private function chunk(string $text, Continuation $read): TextChunk
    {
        $lines = explode("\n", $text);
        $last = $read->filters['line_end'] ?? count($lines);
        if ($read->offset < 1 || $last < $read->offset || ! isset($lines[$read->offset - 1])) {
            throw ToolArgumentInvalid::for('line_start', 'a line in the record and within the selected range');
        }
        if ($read->characterOffset > mb_strlen($lines[$read->offset - 1])) {
            throw ToolArgumentInvalid::for('character_offset', 'a character offset within the selected line');
        }

        $selected = $last < count($lines) ? implode("\n", array_slice($lines, 0, $last)) : $text;
        $chunk = TextChunk::of($selected, $read->offset, $read->characterOffset);

        return strlen(json_encode($chunk->text, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE)) <= 5000
            ? $chunk
            : TextChunk::of($selected, $read->offset, $read->characterOffset, self::ESCAPED_CHUNK_BYTES);
    }
}
