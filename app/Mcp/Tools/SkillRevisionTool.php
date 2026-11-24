<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Support\SkillAuthoringService;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

/**
 * skills_revision: one revision of a stored skill as it was saved.
 */
#[IsReadOnly]
#[VisibleToProfiles]
#[Name('skills_revision')]
#[Description('One revision of a stored skill as saved: name, description, condition and sections.')]
final class SkillRevisionTool extends JournalReadTool
{
    public function __construct(
        private readonly SkillAuthoringService $authoring,
    ) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'skill' => $schema->string()->max(64)->description('The skill number or key.')->required(),
            'revision' => $schema->integer()->min(1)->required(),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        $skill = $this->authoring->storedSkill($arguments->text('skill'));

        $view = $this->authoring->revisionView($skill, $arguments->positiveInteger('revision'));

        return ToolResult::ok($view->toArray(), []);
    }
}
