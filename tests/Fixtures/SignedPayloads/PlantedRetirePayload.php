<?php

declare(strict_types=1);

namespace Tests\Fixtures\SignedPayloads;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\ApiPayload;
use App\Enums\Processes\ApiEffect;
use Spatie\LaravelData\Data;
use Tests\Fixtures\AgentRequests\NoteAnswer;

/**
 * A planted call that breaks two rules: it says it answers another class than its endpoint does, and it names an
 * agent by id.
 *
 * @implements ApiPayload<PlantedAnswer>
 */
#[Endpoint('planted/retire', 'POST', NoteAnswer::class, ApiEffect::Read)]
final class PlantedRetirePayload extends Data implements ApiPayload
{
    public function __construct(public readonly string $agentId) {}
}
