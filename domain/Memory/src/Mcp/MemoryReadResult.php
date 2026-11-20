<?php

declare(strict_types=1);

namespace Domain\Memory\Mcp;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\Continuation;
use App\Mcp\Support\Continuations;
use App\Mcp\Support\TextFields;
use Domain\Memory\Contracts\MemoryResolver;

final readonly class MemoryReadResult
{
    public const string TOOL = 'memories_read';

    public function __construct(
        private MemoryResolver $memories,
        private Continuations $continuations,
        private TextFields $fields,
    ) {}

    public function read(string $id, string|null $cursor): ToolResult
    {
        $memory = $this->memories->memory($id);
        $summary = [
            'memory_id' => $memory->id,
            'number' => $memory->number,
            'weight' => $memory->weight,
            'revision' => $memory->revision,
        ];
        $text = ['text' => $memory->text];

        if ($cursor !== null) {
            $position = $this->continuations->open($cursor, self::TOOL, $id);
            $position->assertCurrentRevision($memory->revision);

            return $this->fields->page($summary, $text, $position, 'memory_id');
        }

        if (strlen(json_encode($text, JSON_THROW_ON_ERROR)) <= 3000) {
            return ToolResult::ok([...$summary, ...$text]);
        }

        $position = $this->fields->start(new Continuation(
            self::TOOL,
            $id,
            [],
            1,
            revision: $memory->revision,
        ), $text);

        return $this->fields->page($summary, $text, $position, 'memory_id');
    }
}
