<?php

declare(strict_types=1);

namespace App\Sharing\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use Spatie\LaravelData\Data;

/**
 * Reads the current actor's share proposals.
 *
 * @implements JournalCall<ShareProposals>
 */
#[Endpoint('sharing/status', 'POST', ShareProposals::class, CallEffect::Read)]
final class ShareStatusCall extends Data implements JournalCall {}
