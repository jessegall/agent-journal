<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Agents\Drivers\Contracts\EnvironmentPart;
use App\Values\DriverStart;
use App\Values\EnvironmentAddition;

/**
 * How long Claude Code waits for the journal's MCP server to start and for each of its tool calls, in milliseconds.
 */
final readonly class ClaudeCodeMcpTimeouts implements EnvironmentPart
{
    private const string START_TIMEOUT_MS = '15000';

    private const string TOOL_TIMEOUT_MS = '30000';

    /**
     * MCP_TIMEOUT and MCP_TOOL_TIMEOUT.
     */
    public function __invoke(DriverStart $start): EnvironmentAddition
    {
        return new EnvironmentAddition([
            'MCP_TIMEOUT='.self::START_TIMEOUT_MS,
            'MCP_TOOL_TIMEOUT='.self::TOOL_TIMEOUT_MS,
        ]);
    }
}
