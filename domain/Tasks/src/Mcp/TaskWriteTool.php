<?php

declare(strict_types=1);

namespace Domain\Tasks\Mcp;

use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Tools\JournalWriteTool;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;

#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
abstract class TaskWriteTool extends JournalWriteTool
{
    /** @return array<string, Type> */
    final protected function taskSchema(JsonSchema $schema): array
    {
        return ['task_id' => $schema->string()->max(26)->required()];
    }

    /** @return array<string, Type> */
    final protected function runSchema(JsonSchema $schema): array
    {
        return [
            ...$this->taskSchema($schema),
            'run_number' => $schema->integer()->min(1)->required(),
        ];
    }
}
