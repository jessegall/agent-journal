<?php

declare(strict_types=1);

namespace Tests\Fixtures\AgentRequests\Invalid;

use App\Attributes\Endpoint;
use App\Contracts\JournalCall;
use App\Enums\CallEffect;
use Spatie\LaravelData\Data;
use Tests\Fixtures\AgentRequests\NoteAnswer;

/**
 * A keyed write that names no receipt owner; the declaration check must refuse it.
 *
 * @implements JournalCall<NoteAnswer>
 */
#[Endpoint('notes/write', 'POST', NoteAnswer::class, CallEffect::KeyedWrite)]
final class WriteWithoutReceiptCall extends Data implements JournalCall {}
