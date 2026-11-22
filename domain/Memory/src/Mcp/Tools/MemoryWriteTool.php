<?php

declare(strict_types=1);

namespace Domain\Memory\Mcp\Tools;

use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Tools\JournalWriteTool;

#[VisibleToProfiles(DiscoveryProfile::MainAgent, DiscoveryProfile::WritingHelper)]
abstract class MemoryWriteTool extends JournalWriteTool
{
    final protected function present(mixed $memoryId): ToolResult
    {
        return ToolResult::ok(['memory_id' => $memoryId]);
    }
}
