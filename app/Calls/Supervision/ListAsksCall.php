<?php

declare(strict_types=1);

namespace App\Calls\Supervision;

use App\Attributes\Endpoint;
use App\Contracts\Domains\JournalCall;
use App\Data\Asks\AskInbox;
use App\Enums\CallEffect;
use App\Values\AskReference;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;

/**
 * @implements JournalCall<AskInbox>
 */
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
