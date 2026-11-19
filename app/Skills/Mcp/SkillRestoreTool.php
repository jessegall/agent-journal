<?php

declare(strict_types=1);

namespace App\Skills\Mcp;

use App\Bus\Contracts\CommandBus;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use App\Skills\Commands\RestoreSkill;
use App\Skills\Support\SkillAuthoring;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Support\Str;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;

/**
 * skills_restore: saves an earlier revision's content as a new revision, as skill:restore does.
 */
#[Name('skills_restore')]
#[Description('Save an earlier revision of a stored skill as its newest revision, checked against today\'s rules; '
    .'history stays.')]
final class SkillRestoreTool extends JournalWriteTool
{
    public function __construct(
        private readonly SkillAuthoring $authoring,
        private readonly CommandBus $commands,
    ) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'skill' => $schema->string()->max(64)->required(),
            'revision' => $schema->integer()->min(1)->required(),
            'expected_revision' => $schema->integer()->min(1)->required(),
            'request_id' => $schema->string()->max(64),
        ];
    }

    protected function write(ToolArguments $arguments): ToolResult
    {
        $requestId = $arguments->optionalText('request_id') ?? (string) Str::ulid();
        $skill = $this->authoring->stored($arguments->text('skill'));
        $result = $this->commands->run(
            new RestoreSkill(
                $skill->id,
                $arguments->positiveInteger('revision'),
                $arguments->positiveInteger('expected_revision'),
                $requestId,
            ),
        );

        return ToolResult::ok($this->authoring->receipt($result, $requestId), []);
    }
}
