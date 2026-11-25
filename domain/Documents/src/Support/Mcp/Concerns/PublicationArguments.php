<?php

declare(strict_types=1);

namespace Domain\Documents\Support\Mcp\Concerns;

use App\Mcp\Exceptions\ToolArgumentInvalid;
use App\Mcp\Support\ToolArguments;
use App\Support\RecordIdentity;
use Domain\Documents\Values\DraftTarget;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Illuminate\JsonSchema\Types\Type;

trait PublicationArguments
{
    /**
     * The schema of a document reference: its number or its id.
     */
    protected function referenceSchema(JsonSchema $schema): Type
    {
        return $schema->anyOf([
            $schema->integer()->min(1),
            $this->optionalRecordIdArgument($schema),
        ])->required();
    }

    /**
     * The draft the document and edit arguments name, at the expected revision when one is given.
     */
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
