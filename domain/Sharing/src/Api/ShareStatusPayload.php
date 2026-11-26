<?php

declare(strict_types=1);

namespace Domain\Sharing\Api;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use Spatie\LaravelData\Data;

/**
 * Reads the current actor's share proposals.
 *
 * @implements ApiPayload<ShareProposals>
 */
#[Endpoint('sharing/status', 'POST', ShareProposals::class, ApiEffect::Read)]
final class ShareStatusPayload extends Data implements ApiPayload {}
