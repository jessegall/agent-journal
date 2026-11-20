<?php

declare(strict_types=1);

namespace App\Skills\Mcp;

use App\Mcp\Attributes\WritesCommand;
use App\Bus\Contracts\CommandBus;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use App\Skills\Commands\CopySkill;
use App\Skills\Support\SkillAuthoring;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Support\Str;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;

/**
 * skills_copy: copies a skill into a new stored skill under a user- key, as skill:copy does.
 */
#[Name('skills_copy')]
#[WritesCommand(CopySkill::class)]
#[Description('Copy a skill you may read, shipped or stored, into a new stored skill under a user- key; the copy is a snapshot of its text.')]
final class SkillCopyTool extends JournalWriteTool
{
    public function __construct(
        private readonly SkillAuthoring $authoring,
        private readonly CommandBus $commands,
    ) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'key' => $schema->string()->max(64)->required(),
            'new_key' => $schema->string()->max(64)->required(),
            'request_id' => $schema->string()->max(64),
        ];
    }

    protected function write(ToolArguments $arguments): ToolResult
    {
        $requestId = $arguments->optionalText('request_id') ?? (string) Str::ulid();
        $result = $this->commands->run(new CopySkill($arguments->text('key'), $arguments->text('new_key'), $requestId));

        return ToolResult::ok($this->authoring->receipt($result, $requestId), []);
    }
}
