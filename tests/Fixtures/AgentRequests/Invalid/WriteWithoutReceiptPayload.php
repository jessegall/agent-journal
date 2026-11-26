<?php

declare(strict_types=1);

namespace Tests\Fixtures\AgentRequests\Invalid;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Processes\Enums\ApiEffect;
use Spatie\LaravelData\Data;
use Tests\Fixtures\AgentRequests\NoteAnswer;

/**
 * A keyed write that names no receipt owner; the declaration check must refuse it.
 *
 * @implements ApiPayload<NoteAnswer>
 */
#[Endpoint('notes/write', 'POST', NoteAnswer::class, ApiEffect::KeyedWrite)]
final class WriteWithoutReceiptPayload extends Data implements ApiPayload {}
