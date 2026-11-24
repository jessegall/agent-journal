<?php

declare(strict_types=1);

namespace Domain\Helpers\Mcp\Tools;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use Domain\Helpers\Commands\ContinueHelper\ContinueHelperCommand;
use Domain\Helpers\Data\HelperReceiptData;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;

#[Name(self::NAME)]
#[IsDestructive(false)]
#[Dispatches(ContinueHelperCommand::class)]
#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
#[Description('Continue a helper job whose launch ended before it finished, in the same conversation.')]
final class ContinueHelperTool extends JournalWriteTool
{
    public const string NAME = 'helpers_continue';

    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'identity_id' => $schema->string()->max(64)->required(),
            'job_id' => $schema->string()->max(64)->required(),
            'model' => $schema->string()->max(200)->required(),
            'driver_key' => $schema->string()->max(64),
        ];
    }

    protected function command(ToolArguments $arguments): ContinueHelperCommand
    {
        return new ContinueHelperCommand(
            $arguments->text('request_key'),
            $arguments->ulid('identity_id'),
            $arguments->ulid('job_id'),
            $arguments->text('model'),
            $arguments->optionalText('driver_key'),
        );
    }

    protected function present(mixed $commandResult): ToolResult
    {
        return ToolResult::ok(HelperReceiptData::from($commandResult)->toArray());
    }
}
