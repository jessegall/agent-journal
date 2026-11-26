<?php

declare(strict_types=1);

namespace App\Api\Supervision;

use App\Asks\Data\AskCard;
use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;

/**
 * @implements ApiPayload<AskCard>
 */
#[Endpoint('asks/show', 'POST', AskCard::class, ApiEffect::Read)]
final class ShowAskPayload extends Data implements ApiPayload
{
    public function __construct(
        #[Ulid]
        public readonly string $id,
    ) {}
}
