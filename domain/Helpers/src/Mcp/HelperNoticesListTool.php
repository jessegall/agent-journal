<?php

declare(strict_types=1);

namespace Domain\Helpers\Mcp;

use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalReadTool;
use Domain\Helpers\Http\Data\HelperNoticeData;
use Domain\Helpers\Readers\HelperNotices;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

#[IsReadOnly]
#[Name('helper_notices_list')]
#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
#[Description('List the notices about your helpers\' jobs that you have not seen yet.')]
final class HelperNoticesListTool extends JournalReadTool
{
    public function __construct(private readonly HelperNotices $notices) {}

    public function schema(JsonSchema $schema): array
    {
        return [];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        $notices = array_map(
            fn (HelperNoticeData $notice) => $notice->toArray(),
            $this->notices->newest(),
        );

        return ToolResult::ok(['notices' => $notices]);
    }
}
