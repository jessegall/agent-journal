<?php

declare(strict_types=1);

namespace App\Data\Processes;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A draft reader of the request and, when the journal proved it, the proof with the exit branches it covers.
 */
#[TypeScript]
final class ReaderProofData extends Data
{
    /**
     * @param  list<string>  $proofs  each proof as its id with the branches it covers
     */
    public function __construct(
        public readonly string $readerRevisionId,
        public readonly int $declarationRevision,
        public readonly array $proofs,
    ) {}
}
