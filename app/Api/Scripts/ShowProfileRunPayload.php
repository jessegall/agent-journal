<?php

declare(strict_types=1);

namespace App\Api\Scripts;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use App\Profiles\Data\ProfileRunData;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;

/**
 * @implements ApiPayload<ProfileRunData>
 */
#[Endpoint('profiles/runs/show', 'POST', ProfileRunData::class, ApiEffect::Read)]
final class ShowProfileRunPayload extends Data implements ApiPayload
{
    public function __construct(
        #[Ulid]
        public readonly string $id,
    ) {}
}
