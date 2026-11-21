<?php

declare(strict_types=1);

namespace App\Text\Calls;

use App\AgentRequests\Attributes\Endpoint;
use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\Text\Data\TextVersionSummary;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Data;

/**
 * Reads a record's text version: the one named, or its current one.
 *
 * @implements JournalCall<TextVersionSummary>
 */
#[Endpoint('text/version', 'POST', TextVersionSummary::class, CallEffect::Read)]
final class ReadTextVersionCall extends Data implements JournalCall
{
    public function __construct(
        #[Max(64)]
        public string $target,
        #[Max(64)]
        public string|null $version = null,
    ) {}
}
