<?php

declare(strict_types=1);

namespace App\Api\Processes;

use App\Attributes\Api\Endpoint;
use App\Attributes\Api\InPath;
use App\Contracts\Domains\ApiPayload;
use App\Enums\Processes\ApiEffect;
use App\Values\ReaderDefinition;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Min;
use Spatie\LaravelData\Data;

/**
 * Proposes a reader for a held command's output, as a draft to prove.
 *
 * @implements ApiPayload<ReaderProposed>
 */
#[Endpoint('processes/requests/{commandRequest}/readers', 'POST', ReaderProposed::class, ApiEffect::Read)]
final class ProposeReaderPayload extends Data implements ApiPayload
{
    public function __construct(
        #[InPath, FromRouteParameter('commandRequest')]
        public string $commandRequest,
        #[MapName('declaration_revision'), Min(1)]
        public int $declarationRevision,
        public ReaderDefinition $definition,
    ) {}
}
