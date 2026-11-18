<?php

declare(strict_types=1);

namespace App\Skills\Mcp;

use App\Bus\Contracts\CommandBus;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use App\Skills\Commands\ReviseSkill;
use App\Skills\Support\SkillAuthoring;
use App\Skills\Values\SkillDraft;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Support\Str;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;

/**
 * skills_edit: saves a new revision of a stored skill against the revision read, as skill:edit does.
 */
#[Name('skills_edit')]
#[Description('Save a new revision of a stored skill against the revision you read; what you leave out stays as it was. A stale expected_revision is refused naming the latest.')]
final class SkillEditTool extends JournalWriteTool
{
    public function __construct(
        private readonly SkillAuthoring $authoring,
        private readonly CommandBus $commands,
    ) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'skill' => $schema->string()->max(64)->description('The skill number or key.')->required(),
            'expected_revision' => $schema->integer()->min(1)->required(),
            'name' => $schema->string()->max(255),
            'description' => $schema->string()->max(1024),
            'body' => $schema->string()->max(262144),
            'conditions' => $schema->string()->max(32768),
            'request_id' => $schema->string()->max(64),
        ];
    }

    protected function write(ToolArguments $arguments): ToolResult
    {
        $requestId = $arguments->optionalText('request_id') ?? (string) Str::ulid();
        $skill = $this->authoring->stored($arguments->text('skill'));
        $current = $this->authoring->currentDraft($skill);
        $body = $arguments->optionalText('body');
        $conditions = $arguments->optionalText('conditions');
        $draft = new SkillDraft(
            $arguments->optionalText('name') ?? $current->name,
            $arguments->optionalText('description') ?? $current->description,
            $body === null ? $current->sections : $this->authoring->sectionsOf($body),
            $conditions === null ? $current->condition : $this->authoring->conditionOf($conditions, [], false),
        );

        return new ToolResult('ok', $this->authoring->receipt($this->commands->run(new ReviseSkill($skill->id, $arguments->positiveInteger('expected_revision'), $requestId, $draft)), $requestId), []);
    }
}
