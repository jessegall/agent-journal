<?php

declare(strict_types=1);

namespace App\Skills\Mcp;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Support\ToolArguments;
use App\Skills\Commands\RestoreSkill;
use App\Skills\Values\SkillReference;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

/**
 * skills_restore: saves an earlier revision's content as a new revision, as skill:restore does.
 */
#[IsIdempotent]
#[IsDestructive(true)]
#[Name('skills_restore')]
#[Dispatches(RestoreSkill::class)]
#[Description(
    "Save an earlier skill revision as its newest revision, checked against today's rules. History stays.",
)]
final class SkillRestoreTool extends SkillWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'skill' => $schema->string()->max(64)->required(),
            'revision' => $schema->integer()->min(1)->required(),
            'expected_revision' => $schema->integer()->min(1)->required(),
            'request_id' => $schema->string()->max(64),
        ];
    }

    protected function command(ToolArguments $arguments): RestoreSkill
    {
        return new RestoreSkill(
            new SkillReference($arguments->text('skill')),
            $arguments->positiveInteger('revision'),
            $arguments->positiveInteger('expected_revision'),
            $this->requestId($arguments),
        );
    }
}
