<?php

declare(strict_types=1);

namespace Tests\Fixtures\AgentRequests\Invalid;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Enums\Processes\ApiEffect;
use App\Enums\Processes\ReceiptOwner;
use Spatie\LaravelData\Data;
use Tests\Fixtures\AgentRequests\NoteAnswer;

/**
 * A read that names a receipt owner, which only a keyed write may; the declaration check must refuse it.
 *
 * @implements ApiPayload<NoteAnswer>
 */
#[Endpoint('notes/read', 'GET', NoteAnswer::class, ApiEffect::Read, ReceiptOwner::CommandBus)]
final class ReadWithReceiptPayload extends Data implements ApiPayload {}
