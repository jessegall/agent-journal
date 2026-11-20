<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp;

use App\Mcp\Data\ToolResult;
use App\Mcp\Tools\JournalWriteTool;
use Domain\Documents\Mcp\Concerns\PublicationArguments;

abstract class DraftWriteTool extends JournalWriteTool
{
    use PublicationArguments;

    final protected function present(mixed $result): ToolResult
    {
        return ToolResult::ok([
            'doc_id' => $result->documentNumber,
            'edit_id' => $result->token,
            'expected_revision' => $result->version,
            'base_revision' => $result->baseRevisionNumber,
            'outline' => array_map(fn (string $line): string => mb_strcut($line, 0, 80), array_slice(
                $result->outline,
                0,
                30,
            )),
        ]);
    }
}
