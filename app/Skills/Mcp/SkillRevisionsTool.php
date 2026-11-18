<?php

declare(strict_types=1);

namespace App\Skills\Mcp;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalReadTool;
use App\Skills\Models\SkillRevision;
use App\Skills\Support\SkillAuthoring;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

/**
 * skills_revisions: a stored skill's revisions, newest first, with its status.
 */
#[Name('skills_revisions')]
#[Description('The revisions of a stored skill, newest first, with its source, current revision, targets, availability and delivery.')]
#[IsReadOnly]
final class SkillRevisionsTool extends JournalReadTool
{
    private const int ROWS = 100;

    public function __construct(
        private readonly SkillAuthoring $authoring,
    ) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'skill' => $schema->string()->max(64)->description('The skill number or key.')->required(),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        $skill = $this->authoring->stored($arguments->text('skill'));

        return new ToolResult('ok', [
            'key' => $skill->key,
            'number' => $skill->number,
            'status' => $this->authoring->statusLines($skill),
            'revisions' => array_map(fn (SkillRevision $revision) => ['revision' => $revision->revision, 'name' => $revision->name, 'author' => "{$revision->author_type->value}:{$revision->author_id}", 'copied_from' => $revision->source_key, 'saved_at' => $revision->created_at->toIso8601String()], SkillRevision::historyOf($skill, self::ROWS)),
        ], []);
    }
}
