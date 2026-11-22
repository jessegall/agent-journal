<?php

declare(strict_types=1);

namespace App\Ui\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What a draft producer made from the answers: the editable fields of the record by their form names, and the agent
 * that drafted them. Nothing is saved until the user submits the form.
 */
#[TypeScript]
final class DraftedRecordData extends Data
{
    /**
     * @param  array<string, string>  $fields
     */
    public function __construct(
        public readonly array $fields,
        public readonly string $agent,
    ) {}
}
