<?php

declare(strict_types=1);

namespace Tests\Fixtures\AgentRequests\Invalid;

use App\Attributes\Endpoint;
use App\Contracts\Domains\JournalCall;
use App\Enums\CallEffect;
use App\Enums\ReceiptOwner;
use Spatie\LaravelData\Data;
use Tests\Fixtures\AgentRequests\NoteAnswer;

/**
 * A read that names a receipt owner, which only a keyed write may; the declaration check must refuse it.
 *
 * @implements JournalCall<NoteAnswer>
 */
#[Endpoint('notes/read', 'GET', NoteAnswer::class, CallEffect::Read, ReceiptOwner::CommandBus)]
final class ReadWithReceiptCall extends Data implements JournalCall {}
