<?php

declare(strict_types=1);

namespace App\Api\Connections;

use App\Attributes\Api\Endpoint;
use App\Attributes\Api\InPath;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Values\ApiAccepted;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Data;

/**
 * Cancels the calling agent's journal verb of this request key; cancelling one that ended changes nothing.
 *
 * @implements ApiPayload<ApiAccepted>
 */
#[Endpoint('api/project-commands/{requestKey}/cancel', 'POST', ApiAccepted::class, ApiEffect::SequencedWrite)]
final class CancelProjectCommandPayload extends Data implements ApiPayload
{
    public function __construct(
        #[InPath, FromRouteParameter('requestKey'), Max(64), Regex('/^[A-Za-z0-9_-]+$/')]
        public readonly string $requestKey,
    ) {}
}
