<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Contracts\Skills\SkillResolver;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Support\SkillPreview;
use App\Values\SkillKey;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

/**
 * Shows who a skill reaches, or one agent's selection.
 */
#[IsReadOnly]
#[VisibleToProfiles]
#[Name('skills_preview')]
#[Description(
    'Show which visible agents a skill reaches, each with a match and reason, or show one agent’s skill selection.',
)]
final class SkillPreviewTool extends JournalReadTool
{
    public function __construct(
        private readonly SkillResolver $skills,
        private readonly SkillPreview $preview,
    ) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'key' => $schema->string()->max(64)->required(),
            'agent' => $schema->string()->max(26)->description('One agent, by id, whose selection to show.'),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        $skill = $this->skills->find(SkillKey::from($arguments->text('key')));
        $agentId = $arguments->optionalText('agent');

        if ($agentId === null) {
            return ToolResult::ok($this->preview->audience($skill), []);
        }

        return ToolResult::ok($this->preview->forAgentId($skill, $this->skills->all(), $agentId)->toArray(), []);
    }
}
