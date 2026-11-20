<?php

declare(strict_types=1);

namespace App\Scripts\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\Profiles\Values\ProfileKey;
use App\Scripts\Data\ProfileDraftData;
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
