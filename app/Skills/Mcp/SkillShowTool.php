<?php

declare(strict_types=1);

namespace App\Skills\Mcp;

use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalReadTool;
use App\Skills\Contracts\SkillResolver;
use App\Skills\Values\SkillKey;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

/**
 * skills_show: one skill's text exactly as it is delivered.
 */
#[IsReadOnly]
#[Name('skills_show')]
#[Description('One skill by key: its owner, source, digest and the exact Markdown it is delivered as.')]
#[VisibleToProfiles]
final class SkillShowTool extends JournalReadTool
{
    public function __construct(
        private readonly SkillResolver $skills,
    ) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'key' => $schema->string()->max(64)->description('The skill key, such as journal-plans.')->required(),
        ];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        $skill = $this->skills->find(SkillKey::from($arguments->text('key')));

        return ToolResult::ok(
            [
                'key' => $skill->key->key,
                'owner' => $skill->owner,
                'source' => $skill->origin->value,
                'digest' => $skill->rendered->digest,
                'markdown' => $skill->rendered->markdown,
            ],
            [],
        );
    }
}
