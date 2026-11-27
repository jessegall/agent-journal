<?php

declare(strict_types=1);

namespace Domain\Tasks\Mcp\Tools;

use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Tools\JournalWriteTool;
use Domain\Tasks\Support\Mcp\TaskReadResult;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;

#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
abstract class TaskWriteTool extends JournalWriteTool
{
    /**
     * @return array<string, Type>
     */
    final protected function runSchema(JsonSchema $schema): array
    {
        return [
            TaskReadResult::ID_ARGUMENT => $this->recordIdArgument($schema),
            'run_number' => $schema->integer()->min(1)->required(),
        ];
    }
}
