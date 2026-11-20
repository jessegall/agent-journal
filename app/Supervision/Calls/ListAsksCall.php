<?php

declare(strict_types=1);

namespace App\Supervision\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;

use App\Supervision\Data\AskInbox;
use App\Supervision\Values\AskReference;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;

/** @implements JournalCall<AskInbox> */
#[Endpoint('asks/list', 'POST', AskInbox::class, CallEffect::Read)]
final class ListAsksCall extends Data implements JournalCall
{
    public function __construct(
        #[Ulid]
        public readonly string|null $before = null,
    ) {}

    public function cursor(): AskReference|null
    {
        return $this->before === null ? null : new AskReference(strtolower($this->before));
    }
}
