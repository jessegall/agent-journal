<?php

declare(strict_types=1);

namespace App\Mcp\Tools;

use App\Mcp\Attributes\Dispatches;
use App\Mcp\Attributes\VisibleToProfiles;
use App\Mcp\Contracts\JobPermissionReader;
use App\Mcp\Enums\DiscoveryProfile;
use App\Mcp\Exceptions\ToolArgumentUnknown;
use App\Mcp\Support\ToolArguments;
use App\Support\ReflectedType;
use BackedEnum;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\JsonSchemaTypeFactory;
use Illuminate\JsonSchema\Types\IntegerType;
use Illuminate\JsonSchema\Types\StringType;
use Laravel\Mcp\Request;
use Laravel\Mcp\Server\Tool;
use PhpOption\Option;

/**
 * The base of every journal tool: a strict published schema and arguments limited to the fields it declares.
 */
abstract class JournalTool extends Tool
{
    /**
     * The argument that names one record by its ULID, which every call must send.
     */
    final protected function recordIdArgument(JsonSchema $schema): StringType
    {
        return $schema->string()->max(26)->required();
    }

    /**
     * An argument that may name one record by its ULID, such as a cursor to read on from.
     */
    final protected function optionalRecordIdArgument(JsonSchema $schema): StringType
    {
        return $schema->string()->max(26);
    }

    /**
     * An argument that holds a whole number from the least to the most, such as how many rows to read.
     */
    final protected function wholeNumberArgument(JsonSchema $schema, int $least, int $most): IntegerType
    {
        return $schema->integer()->min($least)->max($most);
    }

    /**
     * The argument that names one case of an enum by its value.
     *
     * @param  class-string<BackedEnum>  $enum
     */
    final protected function caseArgument(JsonSchema $schema, string $enum): StringType
    {
        return $schema->string()->enum(array_column($enum::cases(), 'value'));
    }

    /**
     * Whether the server offers the tool to the current agent, as its job allows.
     */
    final public function shouldRegister(JobPermissionReader $permissions): bool
    {
        return $permissions->allows($this);
    }

    /**
     * Whether agents of the discovery profile see the tool, as its VisibleToProfiles attribute says.
     */
    final public function isVisibleTo(DiscoveryProfile $profile): bool
    {
        foreach (ReflectedType::of($this)->lineage() as $type) {
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
        return ReflectedType::of($this)->attributes(Dispatches::class)->first();
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
