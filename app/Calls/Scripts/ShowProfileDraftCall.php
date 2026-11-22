<?php

declare(strict_types=1);

namespace App\Calls\Scripts;

use App\Attributes\Endpoint;
use App\Contracts\Domains\JournalCall;
use App\Data\ProfileDraftData;
use App\Enums\CallEffect;
use App\Values\ProfileKey;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

/**
 * @implements JournalCall<ProfileDraftData>
 */
#[Endpoint('profiles/draft/show', 'POST', ProfileDraftData::class, CallEffect::Read)]
final class ShowProfileDraftCall extends Data implements JournalCall
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
