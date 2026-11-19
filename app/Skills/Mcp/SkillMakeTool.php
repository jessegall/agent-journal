<?php

declare(strict_types=1);

namespace App\Skills\Mcp;

use App\Bus\Contracts\CommandBus;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use App\Skills\Commands\CreateSkill;
use App\Skills\Support\SkillAuthoring;
use App\Skills\Values\SkillDraft;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Support\Str;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;

/**
 * skills_make: stores a new skill under a user- key, as skill:make does.
 */
#[Name('skills_make')]
#[Description('Store a new skill under a user- key from a Markdown body; the condition is JSON, everyone when left out. Send the request_id again to retry; it is answered once.')]
final class SkillMakeTool extends JournalWriteTool
{
    public function __construct(
        private readonly SkillAuthoring $authoring,
        private readonly CommandBus $commands,
    ) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'key' => $schema->string()->max(64)->required(),
            'name' => $schema->string()->max(255),
            'description' => $schema->string()->max(1024)->required(),
            'body' => $schema->string()
                ->max(262144)
                ->description('The Markdown body; one section per top-level heading.')
                ->required(),
            'conditions' => $schema->string()
                ->max(32768)
                ->description('The condition as JSON, such as {"type":"profile-bases","version":1,"keys":["main-agent"]}.'),
            'request_id' => $schema->string()->max(64),
        ];
    }

    protected function write(ToolArguments $arguments): ToolResult
    {
        $requestId = $arguments->optionalText('request_id') ?? (string) Str::ulid();
        $key = $arguments->text('key');
        $draft = new SkillDraft(
            $arguments->optionalText('name') ?? $key,
            $arguments->text('description'),
            $this->authoring->sectionsOf($arguments->text('body')),
            $this->authoring->conditionOf($arguments->optionalText('conditions'), []),
        );

        return ToolResult::ok(
            $this->authoring->receipt($this->commands->run(new CreateSkill($key, $requestId, $draft)), $requestId),
            [],
        );
    }
}
