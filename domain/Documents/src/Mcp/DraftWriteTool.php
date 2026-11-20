<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp;

use App\Mcp\Data\ToolResult;
use App\Mcp\Tools\JournalWriteTool;
use App\Text\Support\TextPreview;
use Domain\Documents\Mcp\Concerns\PublicationArguments;

abstract class DraftWriteTool extends JournalWriteTool
{
    use PublicationArguments;

    final protected function present(mixed $view): ToolResult
    {
        return ToolResult::ok([
            'doc_id' => $view->documentNumber,
            'edit_id' => $view->token,
            'expected_revision' => $view->version,
            'base_revision' => $view->baseRevisionNumber,
            'outline' => array_map(fn (string $line) => TextPreview::within($line, 80), $view->outline),
        ]);
    }
}
