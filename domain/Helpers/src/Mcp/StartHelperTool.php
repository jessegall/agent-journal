<?php

declare(strict_types=1);

namespace Domain\Helpers\Mcp;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use Domain\Helpers\Commands\SendHelper;
use Domain\Helpers\Commands\StartHelper;
use Domain\Helpers\Http\Data\HelperReceiptData;
use Domain\Helpers\Mcp\Concerns\HelperWorkArguments;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;

#[IsDestructive(false)]
#[Name('helpers_start')]
#[Dispatches(StartHelper::class)]
#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
#[Description('Start a helper for a bounded job, or give the kept helper identity_id names its next job.')]
final class StartHelperTool extends JournalWriteTool
{
    use HelperWorkArguments {
        writeSchema as workSchema;
    }

    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'identity_id' => $schema->string()->max(64),
            ...$this->workSchema($schema),
        ];
    }

    protected function command(ToolArguments $arguments): StartHelper|SendHelper
    {
        $identity = $arguments->optionalUlid('identity_id');

        if ($identity !== null) {
            return new SendHelper(
                $arguments->text('request_key'),
                $identity,
                $arguments->text('profile_key'),
                $arguments->text('model'),
                $arguments->optionalText('program_key'),
                $this->work($arguments),
            );
        }

        return new StartHelper(
            $arguments->text('request_key'),
            $arguments->text('profile_key'),
            $arguments->text('model'),
            $arguments->optionalText('program_key'),
            $this->work($arguments),
        );
    }

    protected function present(mixed $commandResult): ToolResult
    {
        return ToolResult::ok(HelperReceiptData::from($commandResult)->toArray());
    }
}
