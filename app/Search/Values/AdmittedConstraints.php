<?php

declare(strict_types=1);

namespace App\Search\Values;

use App\Values\AllowedNames;

/**
 * What the reader's grant admits of one source, compiled once per batch: the record ids, views, fields and
 * passages it may see. A provider intersects them with its read scope before it matches, scores or quotes.
 */
final readonly class AdmittedConstraints
{
    public function __construct(
        public AllowedNames $recordIds,
        public AllowedNames $views,
        public AllowedNames $fields,
        public AllowedNames $passages,
    ) {}

    public static function unrestricted(): self
    {
        return new self(AllowedNames::all(), AllowedNames::all(), AllowedNames::all(), AllowedNames::all());
    }

    public function admitsRecord(string $id): bool
    {
        return $this->recordIds->admits($id);
    }

    public function admitsField(string $field): bool
    {
        return $this->fields->admits($field);
    }

    public function hasNothingAdmitted(): bool
    {
        return $this->recordIds->hasNoneAllowed() || $this->views->hasNoneAllowed();
    }
}
