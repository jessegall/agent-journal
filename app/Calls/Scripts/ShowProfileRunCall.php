<?php

declare(strict_types=1);

namespace App\Calls\Scripts;

use App\Attributes\Endpoint;
use App\Contracts\JournalCall;
use App\Data\ProfileRunData;
use App\Enums\CallEffect;
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
