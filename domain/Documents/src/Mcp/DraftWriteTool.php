<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp;

use App\Mcp\Data\ToolResult;
use App\Mcp\Tools\JournalWriteTool;
use Domain\Documents\Mcp\Concerns\PublicationArguments;

abstract class DraftWriteTool extends JournalWriteTool
{
    use PublicationArguments;

    final protected function present(mixed $draftView): ToolResult
    {
        return ToolResult::ok([
            'doc_id' => $draftView->documentNumber,
            'edit_id' => $draftView->token,
            'expected_revision' => $draftView->version,
            'base_revision' => $draftView->baseRevisionNumber,
            'outline' => array_map(fn (string $line): string => mb_strcut($line, 0, 80), array_slice(
                $draftView->outline,
                0,
                30,
            )),
        ]);
    }
}
