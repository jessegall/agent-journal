<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Contracts\Skills\SkillResolver;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Values\SkillEntry;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsReadOnly;

/**
 * skills_list: the skill catalogue, as skill:list shows it.
 */
#[IsReadOnly]
#[VisibleToProfiles]
#[Name('skills_list')]
#[Description('Every skill of the catalogue: key, name, owner, source (shipped or stored), current revision of a stored skill and the digest of its text.')]
final class SkillsListTool extends JournalReadTool
{
    public function __construct(
        private readonly SkillResolver $skills,
    ) {}

    public function schema(JsonSchema $schema): array
    {
        return [];
    }

    protected function read(ToolArguments $arguments): ToolResult
    {
        return ToolResult::ok(
            [
                'skills' => array_map(
                    fn (SkillEntry $skill) => [
                        'key' => $skill->key->key,
                        'name' => $skill->name,
                        'owner' => $skill->owner,
                        'source' => $skill->origin->value,
                        'revision' => $skill->revision,
                        'digest' => $skill->rendered->digest,
                    ],
                    $this->skills->all(),
                ),
            ],
            [],
        );
    }
}
