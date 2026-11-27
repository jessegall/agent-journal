<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Agents\Drivers\Contracts\InstalledVersion;
use App\Mcp\Data\ToolResult;
use App\Mcp\Servers\JournalServer;
use Illuminate\Http\Request;

/**
 * What the caller's connection offers: three separate versions (the journal's MCP contract, the server's build and the
 * MCP protocol of this request), the caller's job profile and the tool names it may use.
 */
final readonly class CapabilitiesResolver
{
    private const string PROTOCOL_HEADER = 'MCP-Protocol-Version';

    public function __construct(
        private McpCatalogue $catalogue,
        private JobPermissionReader $permissions,
        private InstalledVersion $version,
        private Request $request,
    ) {}

    public function read(): ToolResult
    {
        return ToolResult::ok([
            'contract_version' => JournalServer::contractVersion(),
            'server_build' => $this->version->label(),
            'protocol_version' => $this->request->header(self::PROTOCOL_HEADER),
            'job_profile' => $this->permissions->profileKey(),
            'tools' => $this->catalogue->toolNamesFor($this->permissions),
        ], []);
    }
}
