<?php

declare(strict_types=1);

namespace App\Api\Supervision;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Data\Asks\AskCard;
use App\Enums\Processes\ApiEffect;
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
