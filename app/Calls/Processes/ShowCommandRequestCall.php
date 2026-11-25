<?php

declare(strict_types=1);

namespace App\Calls\Processes;

use App\Attributes\Endpoint;
use App\Attributes\InPath;
use App\Contracts\Domains\JournalCall;
use App\Enums\Processes\CallEffect;
use Spatie\LaravelData\Attributes\FromRouteParameter;
use Spatie\LaravelData\Data;

/**
 * Reads a held command request of the current project.
 *
 * @implements JournalCall<CommandRequestShown>
 */
#[Endpoint('processes/requests/{commandRequest}/show', 'POST', CommandRequestShown::class, CallEffect::Read)]
final class ShowCommandRequestCall extends Data implements JournalCall
{
    public function __construct(
        #[InPath, FromRouteParameter('commandRequest')]
        public string $commandRequest,
    ) {}
}
