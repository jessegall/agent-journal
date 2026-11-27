<?php

declare(strict_types=1);

namespace App\Api\Processes;

use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;

/**
 * A held command request: its line, its state, the steps left and its proposals and readers.
 */
final class CommandRequestShown extends Data
{
    /**
     * @param  list<string>  $steps
     * @param  list<array{proposal_id: string, state: string, revision: int}>  $proposals
     * @param  list<array{reader_revision_id: string, declaration_revision: int, proven: bool}>  $readers
     */
    public function __construct(
        #[MapName('request_id')]
        public readonly string $requestId,
        public readonly string $operation,
        public readonly string $line,
        public readonly string $state,
        public readonly array $steps,
        public readonly string $next,
        public readonly array $proposals,
        public readonly array $readers,
    ) {}
}
