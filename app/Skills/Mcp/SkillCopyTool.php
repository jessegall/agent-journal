<?php

declare(strict_types=1);

namespace App\Skills\Mcp;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Support\ToolArguments;
use App\Skills\Commands\CopySkill;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

/**
 * skills_copy: copies a skill into a new stored skill under a user- key, as skill:copy does.
 */
#[IsIdempotent]
#[Name('skills_copy')]
#[IsDestructive(false)]
#[Dispatches(CopySkill::class)]
#[Description(
    'Copy a readable shipped or stored skill under a new user- key. The copy is a snapshot of its text.',
)]
final class SkillCopyTool extends SkillWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'key' => $schema->string()->max(64)->required(),
            'new_key' => $schema->string()->max(64)->required(),
            'request_id' => $schema->string()->max(64),
        ];
    }

    protected function command(ToolArguments $arguments): CopySkill
    {
        $requestId = $this->requestId($arguments);
        return new CopySkill($arguments->text('key'), $arguments->text('new_key'), $requestId);
    }
}
