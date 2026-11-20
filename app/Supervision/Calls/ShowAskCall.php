<?php

declare(strict_types=1);

namespace App\Supervision\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\Supervision\Data\AskCard;
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
