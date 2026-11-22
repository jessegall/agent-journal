<?php

declare(strict_types=1);

namespace Tests\Fixtures\SignedCalls;

use App\Attributes\Endpoint;
use App\Contracts\Domains\JournalCall;
use App\Enums\CallEffect;
use Spatie\LaravelData\Data;
use Tests\Fixtures\AgentRequests\NoteAnswer;

/**
 * A planted call that breaks two rules: it says it answers another class than its endpoint does, and it names an
 * agent by id.
 *
 * @implements JournalCall<PlantedAnswer>
 */
#[Endpoint('planted/retire', 'POST', NoteAnswer::class, CallEffect::Read)]
final class PlantedRetireCall extends Data implements JournalCall
{
    public function __construct(public readonly string $agentId) {}
}
