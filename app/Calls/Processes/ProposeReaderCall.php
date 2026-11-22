<?php

declare(strict_types=1);

namespace App\Calls\Processes;

use App\Attributes\Endpoint;
use App\Attributes\InPath;
use App\Contracts\Domains\JournalCall;
use App\Enums\CallEffect;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

/**
 * Proposes a reader for a held command's output, as a draft to prove.
 *
 * @implements JournalCall<ReaderProposed>
 */
#[Endpoint('processes/requests/{commandRequest}/readers', 'POST', ReaderProposed::class, CallEffect::Read)]
final class ProposeReaderCall extends Data implements JournalCall
{
    /**
     * @param  array<string, mixed>  $definition
     */
    public function __construct(
        #[InPath, FromRouteParameter('commandRequest')]
        public string $commandRequest,
        #[MapName('declaration_revision'), Min(1)]
        public int $declarationRevision,
        public array $definition,
    ) {}
}
