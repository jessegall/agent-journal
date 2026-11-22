<?php

declare(strict_types=1);

namespace Domain\Sequences\Data;

use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The props of the sequence editor: the definition's name and steps (none for a new draft), the version an edit was
 * read at, the registered create or update address and its method, where Cancel and a finished save lead, and the
 * agent that drafted the steps when one did.
 */
#[TypeScript]
final class SequenceEditorPartData extends Data
{
    /**
     * @param  list<SequenceStepData>  $steps
     * @param  'POST'|'PATCH'  $method
     */
    public function __construct(
        public readonly string $name,
        #[DataCollectionOf(SequenceStepData::class)]
        public readonly array $steps,
        public readonly string $saveAddress,
        public readonly string $method,
        public readonly string $cancelAddress,
        public readonly string|Optional $version = new Optional(),
        public readonly string|Optional $draftedBy = new Optional(),
    ) {}
}
