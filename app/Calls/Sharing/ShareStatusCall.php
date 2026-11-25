<?php

declare(strict_types=1);

namespace App\Calls\Sharing;

use App\Attributes\Api\Endpoint;
use App\Contracts\Domains\JournalCall;
use App\Enums\Processes\CallEffect;
use Spatie\LaravelData\Data;

/**
 * Reads the current actor's share proposals.
 *
 * @implements JournalCall<ShareProposals>
 */
#[Endpoint('sharing/status', 'POST', ShareProposals::class, CallEffect::Read)]
final class ShareStatusCall extends Data implements JournalCall {}
