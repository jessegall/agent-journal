<?php

declare(strict_types=1);

namespace App\Skills\Mcp;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Support\ToolArguments;
use App\Skills\Commands\CreateSkill;
use App\Skills\Values\SkillDraftText;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;
use Laravel\Mcp\Server\Tools\Annotations\IsDestructive;
use Laravel\Mcp\Server\Tools\Annotations\IsIdempotent;

/**
 * skills_make: stores a new skill under a user- key, as skill:make does.
 */
#[IsIdempotent]
#[Name('skills_make')]
#[IsDestructive(false)]
#[Dispatches(CreateSkill::class)]
#[Description(
    'Store a new skill under a user- key from Markdown. The JSON condition defaults to everyone. '
    .'To retry, send the same request_key.',
)]
final class SkillMakeTool extends SkillWriteTool
{
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'key' => $schema->string()->max(64)->required(),
            'name' => $schema->string()->max(255),
            'description' => $schema->string()->max(1024)->required(),
            'body' => $schema->string()
                ->max(262144)
                ->description('The Markdown body; one section per top-level heading.')
                ->required(),
            'conditions' => $schema->string()
                ->max(32768)
                ->description(
                    'A JSON condition, such as {"type":"profile-bases","version":1,"keys":["main-agent"]}.',
                ),
            'request_id' => $schema->string()->max(64),
        ];
    }

    protected function command(ToolArguments $arguments): CreateSkill
    {
        $requestId = $this->requestId($arguments);
        $key = $arguments->text('key');
        $draft = new SkillDraftText(
            $arguments->optionalText('name') ?? $key,
            $arguments->text('description'),
            $arguments->text('body'),
            $arguments->textOr('conditions', ''),
        );

        return new CreateSkill($key, $requestId, $draft);
    }
}
