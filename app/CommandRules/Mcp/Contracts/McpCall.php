<?php

declare(strict_types=1);

namespace App\CommandRules\Mcp\Contracts;

use App\Mcp\Data\ToolResult;
use Closure;
use Laravel\Mcp\Response;
use Laravel\Mcp\ResponseFactory;

/**
 * One MCP call of the signed agent: it runs a tool's or resource's answer and turns a failure into a refusal.
 */
interface McpCall
{
    /**
     * @param  Closure(): ToolResult  $toolAnswer
     */
    public function answerTool(string $tool, Closure $toolAnswer): ResponseFactory;

    /**
     * @param  Closure(): Response  $content
     */
    public function answerResource(string $uri, Closure $content): Response;
}
