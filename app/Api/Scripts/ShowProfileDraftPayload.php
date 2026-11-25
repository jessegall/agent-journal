<?php

declare(strict_types=1);

namespace App\Api\Scripts;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Data\Profiles\ProfileDraftData;
use App\Enums\Processes\ApiEffect;
use App\Values\ProfileKey;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

/**
 * @implements ApiPayload<ProfileDraftData>
 */
#[Endpoint('profiles/draft/show', 'POST', ProfileDraftData::class, ApiEffect::Read)]
final class ShowProfileDraftPayload extends Data implements ApiPayload
{
    public function __construct(
        #[Max(64)]
        public readonly string $profile,
    ) {}

    public function profileKey(): ProfileKey
    {
        return ProfileKey::from($this->profile);
    }
}
