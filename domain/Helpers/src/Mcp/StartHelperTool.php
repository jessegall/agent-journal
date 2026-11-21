<?php

declare(strict_types=1);

namespace Domain\Helpers\Mcp;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use Domain\Helpers\Commands\StartHelper;
use Domain\Helpers\Http\Data\HelperReceiptData;
use Domain\Helpers\Mcp\Concerns\HelperWorkArguments;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;

#[IsDestructive(false)]
#[Name('helpers_start')]
#[Dispatches(StartHelper::class)]
#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
#[Description('Start a helper for a bounded job on a profile; the model is named every time.')]
final class StartHelperTool extends JournalWriteTool
{
    use HelperWorkArguments;

    protected function command(ToolArguments $arguments): StartHelper
    {
        return new StartHelper(
            $arguments->text('request_key'),
            $arguments->text('profile_key'),
            $arguments->text('model'),
            $arguments->optionalText('driver_key'),
            $this->work($arguments),
        );
    }

    protected function present(mixed $commandResult): ToolResult
    {
        return ToolResult::ok(HelperReceiptData::from($commandResult)->toArray());
    }
}
