<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Policies\ProcessPolicy;

/**
 * An agent or a user asks the journal to prove a request's draft reader against the real sample runs it names; the
 * answer is the proof, after which the request awaits the owner's approval.
 *
 * @extends Command<string>
 */
#[Authorize(ProcessPolicy::class, AccessType::Test)]
final readonly class ProveReader extends Command
{
    /**
     * @param  list<string>  $runIds
     */
    public function __construct(
        public string $commandRequestId,
        public string $readerRevisionId,
        public array $runIds,
    ) {}
}
