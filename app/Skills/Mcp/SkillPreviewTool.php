<?php

declare(strict_types=1);

namespace App\Skills\Mcp;

use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalReadTool;
use App\Skills\Contracts\SkillResolver;
use App\Skills\Support\SkillPreview;
use App\Skills\Values\SkillKey;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

/**
 * skills_preview: who a skill reaches among the agents the caller may see, or one agent's selection.
 */
#[Name('skills_preview')]
#[Description('Which agents you may see a skill reaches, each with match, no_match or unavailable and a safe reason; '
    .'with agent_id, that agent\'s whole selection. Changes nothing.')]
#[IsReadOnly]
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
