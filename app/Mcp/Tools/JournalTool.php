<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Contracts\JobPermissionReader;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Exceptions\ToolArgumentUnknown;
use App\Mcp\Support\ToolArguments;
use App\Reflection\Support\Reflector;
use Illuminate\JsonSchema\JsonSchemaTypeFactory;
use Laravel\Mcp\Request;
use Laravel\Mcp\Server\Tool;
use PhpOption\Option;

/**
 * The base of every journal tool: a strict published schema and arguments limited to the fields it declares.
 */
abstract class JournalTool extends Tool
{
    final public function shouldRegister(JobPermissionReader $permissions): bool
    {
        return $permissions->allows($this);
    }

    final public function isVisibleTo(DiscoveryProfile $profile): bool
    {
        foreach (Reflector::of($this)->lineage() as $type) {
            if ($type->hasAttribute(VisibleToProfiles::class)) {
                return in_array($profile, $type->attribute(VisibleToProfiles::class)->profiles, true);
            }
        }

        return true;
    }

    /**
     * @return Option<Dispatches>
     */
    final public function writeDeclaration(): Option
    {
        return Reflector::of($this)->attributes(Dispatches::class)->first();
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        $tool = parent::toArray();
        $tool['inputSchema']['additionalProperties'] = false;

        return $tool;
    }

    /**
     * @throws ToolArgumentUnknown
     */
    protected function arguments(Request $request): ToolArguments
    {
        return ToolArguments::read($this->name(), $request, array_keys($this->schema(new JsonSchemaTypeFactory())));
    }
}
