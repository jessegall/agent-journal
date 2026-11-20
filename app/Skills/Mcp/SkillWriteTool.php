<?php

declare(strict_types=1);

namespace App\Skills\Mcp;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use App\Skills\Support\SkillAuthoring;

/** A stored skill write answers with its revision and publication status. */
abstract class SkillWriteTool extends JournalWriteTool
{
    public function __construct(protected readonly SkillAuthoring $authoring) {}

    final protected function requestId(ToolArguments $arguments): string
    {
        return $arguments->optionalText('request_id') ?? hash('sha256', $arguments->text('request_key'));
    }

    final protected function present(mixed $result): ToolResult
    {
        return ToolResult::ok($this->authoring->receipt($result, $result->requestId), []);
    }
}
