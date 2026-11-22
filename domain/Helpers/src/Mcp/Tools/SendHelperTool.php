<?php

declare(strict_types=1);

namespace Domain\Helpers\Mcp\Tools;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use Domain\Helpers\Commands\SendHelper\SendHelperCommand;
use Domain\Helpers\Data\HelperReceiptData;
use Domain\Helpers\Support\Mcp\Concerns\HelperWorkArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;

#[IsDestructive(false)]
#[Name('helpers_send')]
#[Dispatches(SendHelperCommand::class)]
#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
#[Description('Give a kept helper its next job, with its memory of the last.')]
final class SendHelperTool extends JournalWriteTool
{
    use HelperWorkArguments {
        writeSchema as workSchema;
    }

    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'identity_id' => $schema->string()->max(64)->required(),
            ...$this->workSchema($schema),
        ];
    }

    protected function command(ToolArguments $arguments): SendHelperCommand
    {
        return new SendHelperCommand(
            $arguments->text('request_key'),
            $arguments->ulid('identity_id'),
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
