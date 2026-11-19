<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Mcp\Data\ToolResult;
use Illuminate\Config\Repository;
use Illuminate\Http\Request;

/**
 * What the caller's connection offers: three separate versions (the journal's MCP contract, the server's build and the
 * MCP protocol of this request), the caller's job profile and the tool names it may use.
 */
final readonly class CapabilitiesResolver
{
    public const string CONTRACT_VERSION = '1.0.0';

    private const string MAIN_PROFILE = 'main';

    private const string PROTOCOL_HEADER = 'MCP-Protocol-Version';

    public function __construct(private McpCatalogue $catalogue, private Repository $config, private Request $request) {}

    public function read(): ToolResult
    {
        return ToolResult::ok([
            'contract_version' => self::CONTRACT_VERSION,
            'server_build' => $this->config->string('app.version', 'unknown'),
            'protocol_version' => $this->request->header(self::PROTOCOL_HEADER),
            'job_profile' => self::MAIN_PROFILE,
            'tools' => $this->catalogue->toolNames(),
        ], []);
    }
}
