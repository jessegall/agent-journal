<?php

declare(strict_types=1);

namespace App\Api\Processes;

use App\Attributes\Api\Endpoint;
use App\Attributes\Api\InPath;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Data;

/**
 * Reads a held command request of the current project.
 *
 * @implements ApiPayload<CommandRequestShown>
 */
#[Endpoint('processes/requests/{commandRequest}/show', 'POST', CommandRequestShown::class, ApiEffect::Read)]
final class ShowCommandRequestPayload extends Data implements ApiPayload
{
    public function __construct(
        #[InPath, FromRouteParameter('commandRequest')]
        public string $commandRequest,
    ) {}
}
