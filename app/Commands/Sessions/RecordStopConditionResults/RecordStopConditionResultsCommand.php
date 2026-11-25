<?php

declare(strict_types=1);

namespace App\Commands\Sessions\RecordStopConditionResults;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Sessions\StopCheckStatus;
use App\Support\Command;
use App\Values\StopConditionResultReport;

/**
 * The host ran a stop attempt's conditions and reports every result at once; the attempt settles as passed, failed
 * or unresolved. The same submission again answers the stored state; a changed one is refused.
 * Run for an authenticated host by the journal itself: a helper never posts its own results.
 *
 * @extends Command<StopCheckStatus>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RecordStopConditionResultsCommand extends Command
{
    /**
     * @param  list<StopConditionResultReport>  $stopReports
     */
    public function __construct(
        public string $hostId,
        public string $attemptId,
        public string $policyDigest,
        public int $workspaceGeneration,
        public array $stopReports,
    ) {}

    /**
     * A digest of the whole submission, the same for the same results in any order.
     */
    public function submissionDigest(): string
    {
        $fingerprints = array_map(
            fn (StopConditionResultReport $stopReport) => $stopReport->fingerprint(),
            $this->stopReports,
        );

        sort($fingerprints);

        return hash('sha256', json_encode(
            [
                $this->policyDigest,
                $this->workspaceGeneration,
                $fingerprints,
            ],
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

        foreach ($this->stopReports as $stopReport) {
            $hashes[$stopReport->conditionKey] = $stopReport->definitionHash;
        }

        return $hashes;
    }

    /**
     * Whether no condition is reported twice.
     */
    public function isEachConditionReportedOnce(): bool
    {
        return count($this->definitionHashes()) === count($this->stopReports);
    }
}
