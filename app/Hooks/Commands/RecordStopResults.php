<?php

declare(strict_types=1);

namespace App\Hooks\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Hooks\Enums\StopAttemptState;
use App\Hooks\Handlers\RecordStopResultsHandler;
use App\Hooks\Values\StopResultReport;

/**
 * The host ran a stop attempt's conditions and reports every result at once; the attempt settles as passed, failed
 * or unresolved. The same submission again answers the stored state; a changed one is refused.
 * Run for an authenticated host by the journal itself: a helper never posts its own results.
 *
 * @extends Command<StopAttemptState>
 */
#[Entry(CommandEntry::HostControl)]
#[HandledBy(RecordStopResultsHandler::class)]
final readonly class RecordStopResults extends Command
{
    /**
     * @param  list<StopResultReport>  $results
     */
    public function __construct(
        public string $hostId,
        public string $attemptId,
        public string $policyDigest,
        public int $workspaceGeneration,
        public array $results,
    ) {}

    /**
     * A digest of the whole submission, the same for the same results in any order.
     */
    public function submissionDigest(): string
    {
        $fingerprints = array_map(fn (StopResultReport $result): array => $result->fingerprint(), $this->results);
        sort($fingerprints);

        return hash('sha256', json_encode(
            [$this->policyDigest, $this->workspaceGeneration, $fingerprints],
            JSON_THROW_ON_ERROR,
        ));
    }

    /**
     * Every reported condition with the hash of the definition the host ran.
     *
     * @return array<string, string>
     */
    public function definitionHashes(): array
    {
        $hashes = [];

        foreach ($this->results as $result) {
            $hashes[$result->conditionKey] = $result->definitionHash;
        }

        return $hashes;
    }

    /**
     * Whether no condition is reported twice.
     */
    public function isEachConditionReportedOnce(): bool
    {
        return count($this->definitionHashes()) === count($this->results);
    }
}
