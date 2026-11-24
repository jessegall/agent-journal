<?php

declare(strict_types=1);

namespace App\Calls\Supervision;

use App\Attributes\Endpoint;
use App\Contracts\Domains\JournalCall;
use App\Data\Asks\AskCard;
use App\Enums\CallEffect;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;

/**
 * @implements JournalCall<AskCard>
 */
#[Endpoint('asks/show', 'POST', AskCard::class, CallEffect::Read)]
final class ShowAskCall extends Data implements JournalCall
{
    public function __construct(
        #[Ulid]
        public readonly string $id,
    ) {}
}
