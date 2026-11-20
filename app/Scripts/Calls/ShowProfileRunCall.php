<?php

declare(strict_types=1);

namespace App\Scripts\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\Scripts\Data\ProfileRunData;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;

/**
 * @implements JournalCall<ProfileRunData>
 */
#[Endpoint('profiles/runs/show', 'POST', ProfileRunData::class, CallEffect::Read)]
final class ShowProfileRunCall extends Data implements JournalCall
{
    public function __construct(
        #[Ulid]
        public readonly string $id,
    ) {}
}
