<?php

declare(strict_types=1);

namespace Domain\Documents\Support\Mcp;

use App\Mcp\Contracts\Continuations;
use App\Mcp\Data\ToolResult;
use App\Mcp\Exceptions\ToolArgumentInvalid;
use App\Mcp\Support\Continuation;
use App\Mcp\Support\TextChunk;
use App\Mcp\Support\ToolArguments;
use App\Support\MarkdownText;

final readonly class PublicationChunks
{
    private const int ESCAPED_CHUNK_BYTES = 900;

    public function __construct(private Continuations $continuations) {}

    public function range(Continuation $position, MarkdownText $body, ToolArguments $arguments): Continuation
    {
        $section = $arguments->optionalText('section');
        $firstLine = $arguments->optionalWholeNumber('line_start');
        $lastLine = $arguments->optionalWholeNumber('line_end');
        $offset = $arguments->optionalWholeNumber('character_offset');

        if ($section !== null && ($firstLine !== null || $lastLine !== null || $offset !== null)) {
            throw ToolArgumentInvalid::for('section', 'a section without line or character arguments');
        }

        if ($offset !== null && ($firstLine === null || ($lastLine !== null && $lastLine !== $firstLine))) {
            throw ToolArgumentInvalid::for('character_offset', 'a character offset on one explicitly selected line');
        }

        if ($offset !== null) {
            $lastLine = $firstLine;
        }

        if ($section !== null) {
            $selected = $body->sectionBy($section);
            $firstLine = $selected->firstLine;
            $lastLine = $selected->lastLine;
        }

        return new Continuation(
            $position->tool,
            $position->selector,
            [
                ...$position->filters,
                'line_end' => $lastLine,
            ],
            $firstLine ?? 1,
            $offset ?? 0,
            $position->revision,
        );
    }

    /**
     * @param  array<string, mixed>  $card
     */
    public function page(string $text, Continuation $position, string $selectorName, array $card): ToolResult
    {
        $chunk = $this->chunk($text, $position);

        $next = $chunk->hasMore ? [$this->continuations->link(new Continuation(
            $position->tool,
            $position->selector,
            $position->filters,
            $chunk->nextLine,
            $chunk->nextCharacter,
            $position->revision,
        ), $selectorName)] : [];

        return ToolResult::ok([
            ...$card,
            'body' => $chunk->text,
            'line_start' => $chunk->lineStart,
            'line_end' => $chunk->nextCharacter > 0 ? $chunk->nextLine : $chunk->nextLine - 1,
            'character_offset' => $chunk->characterStart,
            'ends_line' => $chunk->nextCharacter === 0,
        ], $next);
    }

    private function chunk(string $text, Continuation $position): TextChunk
    {
        $lines = explode("\n", $text);
        $lastLine = $position->filters['line_end'] ?? count($lines);

        if ($position->offset < 1 || $lastLine < $position->offset || ! isset($lines[$position->offset - 1])) {
            throw ToolArgumentInvalid::for('line_start', 'a line in the record and within the selected range');
        }

        if ($position->characterOffset > mb_strlen($lines[$position->offset - 1])) {
            throw ToolArgumentInvalid::for('character_offset', 'a character offset within the selected line');
        }

        $selected = $lastLine < count($lines) ? implode("\n", array_slice($lines, 0, $lastLine)) : $text;
        $chunk = TextChunk::of($selected, $position->offset, $position->characterOffset);

        if (strlen(json_encode($chunk->text, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE)) <= 5000) {
            return $chunk;
        }

        return TextChunk::of($selected, $position->offset, $position->characterOffset, self::ESCAPED_CHUNK_BYTES);
    }
}
