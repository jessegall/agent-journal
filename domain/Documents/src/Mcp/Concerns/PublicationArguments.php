<?php

declare(strict_types=1);

namespace Domain\Documents\Mcp\Concerns;

use App\Mcp\Exceptions\ToolArgumentInvalid;
use App\Mcp\Support\ToolArguments;
use App\Records\Support\RecordIdentity;
use Domain\Documents\Api\DraftTarget;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;

trait PublicationArguments
{
    protected function referenceSchema(JsonSchema $schema): Type
    {
        return $schema->anyOf([$schema->integer()->min(1), $schema->string()->max(26)])->required();
    }

    protected function target(ToolArguments $arguments, int|null $expectedRevision = null): DraftTarget
    {
        return new DraftTarget(
            (string) $arguments->recordReference('doc_id'),
            $arguments->text('edit_id'),
            $expectedRevision,
        );
    }

    /**
     * @return list<RecordIdentity>
     */
    protected function sources(ToolArguments $arguments): array
    {
        $sources = $arguments->optionalList('source_references');
        if (count($sources) > 50) {
            throw ToolArgumentInvalid::for('source_references', 'at most 50 record references');
        }

        return array_map($this->source(...), $sources);
    }

    private function source(string $reference): RecordIdentity
    {
        $parts = explode(':', $reference, 2);
        if (count($parts) !== 2) {
            throw ToolArgumentInvalid::for('source_references', 'a list of record aliases and ids joined by a colon');
        }

        return new RecordIdentity($parts[0], strtolower($parts[1]));
    }
}
