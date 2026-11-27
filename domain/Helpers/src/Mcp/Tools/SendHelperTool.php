<?php

declare(strict_types=1);

namespace Domain\Helpers\Mcp\Tools;

use App\Bus\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use App\Projects\Contracts\ProjectDestination;
use Domain\Helpers\Commands\SendHelper\SendHelperCommand;
use Domain\Helpers\Data\HelperReceiptData;
use Domain\Helpers\Support\Mcp\Concerns\HelperWorkArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use PhpOption\None;

#[Name(self::NAME)]
#[IsDestructive(false)]
#[Dispatches(SendHelperCommand::class)]
#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
#[Description('Give a kept helper its next job, with its memory of the last.')]
final class SendHelperTool extends JournalWriteTool
{
    public const string NAME = 'helpers_send';

    use HelperWorkArguments {
        writeSchema as workSchema;
    }

    public function __construct(private readonly ProjectDestination $destination) {}

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
            $this->projectId(),
        );
    }

    protected function present(mixed $commandResult): ToolResult
    {
        return ToolResult::ok(HelperReceiptData::from($commandResult));
    }

    /**
     * The calling agent's project, which the helper works in.
     */
    private function projectId(): string
    {
        return $this->destination->projectFor(None::create());
    }
}
