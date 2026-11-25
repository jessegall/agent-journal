<?php

declare(strict_types=1);

namespace App\Calls\Connections;

use App\Attributes\Endpoint;
use App\Contracts\Domains\JournalCall;
use App\Enums\Processes\CallEffect;
use App\Exceptions\VerbNotServed;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Attributes\Validation\Max;
use Spatie\LaravelData\Attributes\Validation\Regex;
use Spatie\LaravelData\Attributes\Validation\Ulid;
use Spatie\LaravelData\Data;

/**
 * Reads what became of the calling agent's own journal verb of this request id on this binding, after its answer was
 * lost; it starts nothing.
 *
 * @implements JournalCall<ProjectCommandStatus>
 */
#[Endpoint(
    'api/project-commands/status',
    'POST',
    ProjectCommandStatus::class,
    CallEffect::Read,
    refusals: [VerbNotServed::class],
)]
final class ReadProjectCommandStatusCall extends Data implements JournalCall
{
    public function __construct(
        #[Ulid, MapName('binding')]
        public readonly string $bindingId,
        #[MapName('request_key'), Max(64), Regex('/^[A-Za-z0-9_-]+$/')]
        public readonly string $requestKey,
    ) {}
}
