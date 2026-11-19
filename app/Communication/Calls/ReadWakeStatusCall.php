<?php

declare(strict_types=1);

namespace App\Communication\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use Spatie\LaravelData\Attributes\Validation\Size;
use Spatie\LaravelData\Data;

/**
 * Reads, for the message's author, whether each notified member's runtime accepted the wake.
 *
 * @implements JournalCall<WakeStatuses>
 */
#[Endpoint('communication/wake-status', 'POST', WakeStatuses::class, CallEffect::Read)]
final class ReadWakeStatusCall extends Data implements JournalCall
{
    public function __construct(
        #[Size(26)]
        public string $messageId,
    ) {}
}
