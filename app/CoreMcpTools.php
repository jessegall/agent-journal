<?php

declare(strict_types=1);

namespace App;

use App\Mcp\Contracts\McpRegistration;
use App\Mcp\Resources\JournalResource;
use App\Mcp\Resources\OperationResource;
use App\Mcp\Resources\OverviewResource;
use App\Mcp\Tools\AssigneesListTool;
use App\Mcp\Tools\AssignmentReadTool;
use App\Mcp\Tools\CapabilitiesReadTool;
use App\Mcp\Tools\JournalTool;
use App\Mcp\Tools\OperationsReadTool;
use App\Mcp\Tools\OverviewReadTool;
use App\Skills\Mcp\SkillCopyTool;
use App\Skills\Mcp\SkillEditTool;
use App\Skills\Mcp\SkillMakeTool;
use App\Skills\Mcp\SkillPreviewTool;
use App\Skills\Mcp\SkillRestoreTool;
use App\Skills\Mcp\SkillRetireTool;
use App\Skills\Mcp\SkillRevisionsTool;
use App\Skills\Mcp\SkillRevisionTool;
use App\Skills\Mcp\SkillShowTool;
use App\Skills\Mcp\SkillsListTool;

/**
 * Core's own MCP tools and resources, added to the catalogue before the domains'.
 */
final class CoreMcpTools
{
    /**
     * @return list<class-string<JournalTool>>
     */
    public static function tools(): array
    {
        return [
            OverviewReadTool::class, CapabilitiesReadTool::class, OperationsReadTool::class, AssignmentReadTool::class, AssigneesListTool::class,
            SkillsListTool::class, SkillShowTool::class, SkillPreviewTool::class, SkillRevisionsTool::class, SkillRevisionTool::class,
            SkillMakeTool::class, SkillEditTool::class, SkillRestoreTool::class, SkillRetireTool::class, SkillCopyTool::class,
        ];
    }

    /**
     * @return list<class-string<JournalResource>>
     */
    public static function resources(): array
    {
        return [OverviewResource::class, OperationResource::class];
    }

    public static function registerIn(McpRegistration $registration): void
    {
        foreach (self::tools() as $tool) {
            $registration->registerTool($tool);
        }

        foreach (self::resources() as $resource) {
            $registration->registerResource($resource);
        }
    }
}
