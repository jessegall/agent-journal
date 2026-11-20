<?php

declare(strict_types=1);

namespace App\Skills\Mcp;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Support\ToolArguments;
use App\Skills\Commands\RetireSkill;
use App\Skills\Values\SkillReference;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

/**
 * skills_retire: retires a stored skill its owner names, as skill:retire does.
 */
#[IsIdempotent]
#[IsDestructive(true)]
#[Name('skills_retire')]
#[Dispatches(RetireSkill::class)]
#[Description('Retire a stored skill you own; it leaves every selection and its revisions stay readable.')]
final class SkillRetireTool extends SkillWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'skill' => $schema->string()->max(64)->required(),
            'expected_revision' => $schema->integer()->min(1)->required(),
            'request_id' => $schema->string()->max(64),
        ];
    }

    protected function command(ToolArguments $arguments): RetireSkill
    {
        return new RetireSkill(
            new SkillReference($arguments->text('skill')),
            $arguments->positiveInteger('expected_revision'),
            $this->requestId($arguments),
        );
    }
}
