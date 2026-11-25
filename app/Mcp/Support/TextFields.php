<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Mcp\Contracts\TextFields as TextFieldsContract;
use App\Mcp\Data\NextAction;
use App\Mcp\Data\ToolResult;
use App\Mcp\Exceptions\ContinuationStale;

/**
 * Pages named fields of a record's text without splitting a Unicode character.
 */
final readonly class TextFields implements TextFieldsContract
{
    private const int CHUNK_BYTES = 900;

    public function __construct(private Continuations $continuations) {}

    /**
     * @param  array<string, string>  $text
     */
    public function start(Continuation $record, array $text): Continuation
    {
        return new Continuation(
            $record->tool,
            $record->selector,
            [
                ...$record->filters,
                'field' => 0,
                'text_digest' => $this->digest($text),
            ],
            1,
            revision: $record->revision,
        );
    }

    /**
     * @param  array<string, string>  $text
     */
    public function startAt(Continuation $record, array $text, string $field, int $line, int $character): Continuation
    {
        $index = array_search($field, array_keys($text), true);

        return new Continuation(
            $record->tool,
            $record->selector,
            [
                ...$record->filters,
                'field' => $index === false ? 0 : $index,
                'text_digest' => $this->digest($text),
            ],
            $line,
            $character,
            revision: $record->revision,
        );
    }

    /**
     * @param  array<string, mixed>  $summary
     * @param  array<string, string>  $text
     */
    public function page(array $summary, array $text, Continuation $position, string $selectorName): ToolResult
    {
        if ($position->filters['text_digest'] !== $this->digest($text)) {
            throw ContinuationStale::textChanged();
        }

        $field = (int) $position->filters['field'];
        $name = array_keys($text)[$field];
        $chunk = TextChunk::of($text[$name], $position->offset, $position->characterOffset, self::CHUNK_BYTES);

        return ToolResult::ok([
            ...$summary,
            $name => $chunk->text,
            'text_field' => $name,
            'line_start' => $chunk->lineStart,
            'character_offset' => $chunk->characterStart,
        ], $this->next($position, $chunk, $field, count($text), $selectorName));
    }

    /**
     * @param  array<string, string>  $text
     */
    private function digest(array $text): string
    {
        return hash('sha256', json_encode($text, JSON_THROW_ON_ERROR));
    }

    /**
     * @return list<NextAction>
     */
    private function next(Continuation $position, TextChunk $chunk, int $field, int $total, string $selectorName): array
    {
        if (! $chunk->hasMore && $field + 1 >= $total) {
            return [];
        }

        return [$this->continuations->link(
            new Continuation(
                $position->tool,
                $position->selector,
                [
                    ...$position->filters,
                    'field' => $chunk->hasMore ? $field : $field + 1,
                ],
                $chunk->hasMore ? $chunk->nextLine : 1,
                $chunk->hasMore ? $chunk->nextCharacter : 0,
                $position->revision,
            ),
            $selectorName,
        )];
    }
}
