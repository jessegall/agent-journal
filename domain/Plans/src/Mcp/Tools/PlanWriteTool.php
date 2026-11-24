<?php

declare(strict_types=1);

namespace Domain\Plans\Mcp\Tools;

use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Tools\JournalWriteTool;
use Domain\Plans\Enums\PlanType;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\StringType;
use Illuminate\JsonSchema\Types\Type;

#[VisibleToProfiles(DiscoveryProfile::MainAgent)]
abstract class PlanWriteTool extends JournalWriteTool
{
    /**
     * @return array<string, Type>
     */
    final protected function planRevisionSchema(JsonSchema $schema): array
    {
        return [
            'plan_id' => $schema->string()->max(26)->required(),
            'expected_revision' => $schema->integer()->min(1)->required(),
        ];
    }

    /**
     * The schema of a plan type argument: one of the plan types.
     */
    final protected function typeSchema(JsonSchema $schema): StringType
    {
        return $this->caseArgument($schema, PlanType::class);
    }
}
