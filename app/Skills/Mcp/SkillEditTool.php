<?php

declare(strict_types=1);

namespace App\Skills\Mcp;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Support\ToolArguments;
use App\Skills\Commands\ReviseSkill;
use App\Skills\Values\SkillDraftChanges;
use App\Skills\Values\SkillReference;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

/**
 * skills_edit: saves a new revision of a stored skill against the revision read, as skill:edit does.
 */
#[IsIdempotent]
#[Name('skills_edit')]
#[IsDestructive(true)]
#[Dispatches(ReviseSkill::class)]
#[Description(
    'Save a new revision of a stored skill against the revision you read. Omitted fields keep their values. '
    .'A stale expected_revision is refused with the latest revision.',
)]
final class SkillEditTool extends SkillWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'skill' => $schema->string()->max(64)->description('The skill number or key.')->required(),
            'expected_revision' => $schema->integer()->min(1)->required(),
            'name' => $schema->string()->max(255),
            'description' => $schema->string()->max(1024),
            'body' => $schema->string()->max(262144),
            'conditions' => $schema->string()->max(32768),
            'request_id' => $schema->string()->max(64),
        ];
    }

    protected function command(ToolArguments $arguments): ReviseSkill
    {
        return new ReviseSkill(
            new SkillReference($arguments->text('skill')),
            $arguments->positiveInteger('expected_revision'),
            $this->requestId($arguments),
            new SkillDraftChanges(
                $arguments->optionalText('name'),
                $arguments->optionalText('description'),
                $arguments->optionalText('body'),
                $arguments->optionalText('conditions'),
            ),
        );
    }
}
