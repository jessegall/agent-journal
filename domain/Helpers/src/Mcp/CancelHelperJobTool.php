<?php

declare(strict_types=1);

namespace Domain\Helpers\Mcp;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use Domain\Helpers\Commands\CancelHelperJob;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

#[IsIdempotent]
#[IsDestructive]
#[Name('helpers_cancel')]
#[Dispatches(CancelHelperJob::class)]
#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
#[Description('Cancel a helper job and stop its launch.')]
final class CancelHelperJobTool extends JournalWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return ['job_id' => $schema->string()->max(64)->required()];
    }

    protected function command(ToolArguments $arguments): CancelHelperJob
    {
        return new CancelHelperJob($arguments->ulid('job_id'), $arguments->text('request_key'));
    }

    protected function present(mixed $commandResult): ToolResult
    {
        return ToolResult::ok(['job_id' => $commandResult]);
    }
}
