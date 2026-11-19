<?php

declare(strict_types=1);

namespace Tests\Fixtures\AgentRequests\Invalid;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\AgentRequests\Enums\ReceiptOwner;
use Spatie\LaravelData\Data;
use Tests\Fixtures\AgentRequests\NoteAnswer;

/**
 * A read that names a receipt owner, which only a keyed write may; the declaration check must refuse it.
 *
 * @implements JournalCall<NoteAnswer>
 */
#[Endpoint('notes/read', 'GET', NoteAnswer::class, CallEffect::Read, ReceiptOwner::CommandBus)]
final class ReadWithReceiptCall extends Data implements JournalCall {}
