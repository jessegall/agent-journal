<?php

declare(strict_types=1);

namespace Domain\Helpers\Mcp\Tools;

use App\Attributes\Bus\Dispatches;
use App\Contracts\Projects\ProjectDestination;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use Domain\Helpers\Commands\StartHelper\StartHelperCommand;
use Domain\Helpers\Data\HelperReceiptData;
use Domain\Helpers\Support\Mcp\Concerns\HelperWorkArguments;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use PhpOption\None;

#[IsDestructive(false)]
#[Name('helpers_start')]
#[Dispatches(StartHelperCommand::class)]
#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
#[Description('Start a helper for a bounded job on a profile; the model is named every time.')]
final class StartHelperTool extends JournalWriteTool
{
    use HelperWorkArguments;

    public function __construct(private readonly ProjectDestination $destination) {}

    protected function command(ToolArguments $arguments): StartHelperCommand
    {
        return new StartHelperCommand(
            $arguments->text('request_key'),
            $arguments->text('profile_key'),
            $arguments->text('model'),
            $arguments->optionalText('driver_key'),
            $this->work($arguments),
            $this->destination->projectFor(None::create()),
        );
    }

    protected function present(mixed $commandResult): ToolResult
    {
        return ToolResult::ok(HelperReceiptData::from($commandResult)->toArray());
    }
}
