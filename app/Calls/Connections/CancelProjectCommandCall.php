<?php

declare(strict_types=1);

namespace App\Calls\Connections;

use App\Attributes\Endpoint;
use App\Attributes\InPath;
use App\Contracts\Domains\JournalCall;
use App\Enums\Processes\CallEffect;
use App\Values\CallAccepted;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Data;

/**
 * Cancels the calling agent's journal verb of this request key; cancelling one that ended changes nothing.
 *
 * @implements JournalCall<CallAccepted>
 */
#[Endpoint('api/project-commands/{requestKey}/cancel', 'POST', CallAccepted::class, CallEffect::SequencedWrite)]
final class CancelProjectCommandCall extends Data implements JournalCall
{
    public function __construct(
        #[InPath, FromRouteParameter('requestKey'), Max(64), Regex('/^[A-Za-z0-9_-]+$/')]
        public readonly string $requestKey,
    ) {}
}
