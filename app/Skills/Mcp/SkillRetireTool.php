<?php

declare(strict_types=1);

namespace App\Skills\Mcp;

use App\Mcp\Attributes\WritesCommand;
use App\Bus\Contracts\CommandBus;
use App\Mcp\Data\ToolResult;
use App\Mcp\Support\ToolArguments;
use App\Mcp\Tools\JournalWriteTool;
use App\Skills\Commands\RetireSkill;
use App\Skills\Support\SkillAuthoring;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\Support\Str;
use Laravel\Mcp\Server\Attributes\Description;
use Laravel\Mcp\Server\Attributes\Name;

/**
 * skills_retire: retires a stored skill its owner names, as skill:retire does.
 */
#[Name('skills_retire')]
#[WritesCommand(RetireSkill::class)]
#[Description('Retire a stored skill you own; it leaves every selection and its revisions stay readable.')]
final class SkillRetireTool extends JournalWriteTool
{
    public function __construct(
        private readonly SkillAuthoring $authoring,
        private readonly CommandBus $commands,
    ) {}

    public function schema(JsonSchema $schema): array
    {
        return [
            'skill' => $schema->string()->max(64)->required(),
            'expected_revision' => $schema->integer()->min(1)->required(),
            'request_id' => $schema->string()->max(64),
        ];
    }

    protected function write(ToolArguments $arguments): ToolResult
    {
        $requestId = $arguments->optionalText('request_id') ?? (string) Str::ulid();
        $skill = $this->authoring->stored($arguments->text('skill'));
        $result = $this->commands->run(
            new RetireSkill($skill->id, $arguments->positiveInteger('expected_revision'), $requestId),
        );

        return ToolResult::ok($this->authoring->receipt($result, $requestId), []);
    }
}
