<?php

declare(strict_types=1);

namespace App\Commands\ProveReader;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\ProcessPolicy;
use App\Support\Command;

/**
 * An agent or a user asks the journal to prove a request's draft reader against the real sample runs it names; the
 * answer is the proof, after which the request awaits the owner's approval.
 *
 * @extends Command<string>
 */
#[Authorize(ProcessPolicy::class, AccessType::Test)]
final readonly class ProveReaderCommand extends Command
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
