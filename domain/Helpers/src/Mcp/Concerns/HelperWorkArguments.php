<?php

declare(strict_types=1);

namespace Domain\Helpers\Mcp\Concerns;

use App\Mcp\Support\ToolArguments;
use Domain\Helpers\Values\HelperWork;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;

/**
 * The helper and the work a start or send names, as the signed helper calls take them.
 */
trait HelperWorkArguments
{
    /**
     * @return array<string, Type>
     */
    protected function writeSchema(JsonSchema $schema): array
    {
        return [
            'profile_key' => $schema->string()->max(128)->required(),
            'model' => $schema->string()->max(200)->required(),
            'driver_key' => $schema->string()->max(64),
            'subject' => $schema->string()->max(200),
            'purpose_id' => $schema->string()->max(64),
            'purpose_text' => $schema->string()->max(2000),
            'brief' => $schema->string()->max(20000)->required(),
            'source_subjects' => $schema->array()->items($schema->string()->max(200)),
            'independent' => $schema->boolean(),
        ];
    }

    private function work(ToolArguments $arguments): HelperWork
    {
        return HelperWork::described(
            $arguments->optionalText('subject'),
            $arguments->optionalText('purpose_id'),
            $arguments->optionalText('purpose_text'),
            $arguments->text('brief'),
            $arguments->optionalList('source_subjects'),
            ($arguments->arguments['independent'] ?? false) === true,
        );
    }
}
