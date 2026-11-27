<?php

declare(strict_types=1);

namespace App\Sessions\Commands\SettleFencedStopCheck;

use App\Accounts\Enums\CommandEntry;
use App\Bus\Contracts\CommandHandler;
use App\Bus\Contracts\JournalCommands;
use App\Hooks\Data\StopConditionResultData;
use App\Hosts\Enums\HostInstructionStatus;
use App\Hosts\Protocol\Payloads\HostFencedResultPayload;
use App\Hosts\Protocol\Payloads\HostFencedResultsPayload;
use App\Models\Hosts\HostInstruction;
use App\Models\Sessions\StopCheck;
use App\Sessions\Commands\RecordStopConditionResults\RecordStopConditionResultsCommand;
use App\Sessions\Contracts\SessionPolicyReader;
use App\Sessions\Enums\StopCheckStatus;
use App\Values\StopCondition;

/**
 * Records each condition's result the host answered, in the order the conditions ran; a run the host refused, such
 * as while a process of the session still ran, leaves the attempt unresolved, so the agent's next stop asks again.
 */
final readonly class SettleFencedStopCheckHandler implements CommandHandler
{
    private const string TRUSTED_ENTRY = 'stop conditions';

    private const string REFUSED_SUBMISSION = 'fence-refused';

    public function __construct(private SessionPolicyReader $policies, private JournalCommands $commands) {}

    public function handle(SettleFencedStopCheckCommand $command): void
    {
        $instruction = HostInstruction::findLocked($command->instructionId);

        foreach (StopCheck::findRunUnder($instruction->id) as $attempt) {
            if ($attempt->status !== StopCheckStatus::Pending) {
                return;
            }

            if ($instruction->status === HostInstructionStatus::Refused) {
                $reason = "the host refused to run the conditions: {$instruction->refusal?->value}";
                $attempt->settle(StopCheckStatus::Unresolved, self::REFUSED_SUBMISSION, $reason);

                return;
            }

            $conditions = $this->policies->policyFor($attempt->session_id)->stopConditions->conditions;
            $results = HostFencedResultsPayload::from($instruction->answer->facts ?? [])->results;

            $rows = array_map(
                fn (HostFencedResultPayload $result, int $index) => $this->rowOf($conditions[$index], $result),
                $results,
                array_keys($results),
            );

            $reports = array_values(array_map(
                fn (StopConditionResultData $result) => $result->report(),
                StopConditionResultData::collect($rows),
            ));

            $record = new RecordStopConditionResultsCommand(
                $instruction->host_id,
                $attempt->id,
                $attempt->policy_digest,
                $attempt->workspace_generation,
                $reports,
            );

            $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $record);
        }
    }

    /**
     * The host's result of the run as a result row, the condition's own in the order the conditions ran.
     *
     * @return array<string, mixed>
     */
    private function rowOf(StopCondition $condition, HostFencedResultPayload $result): array
    {
        return [
            ...$result->toArray(),
            'condition_key' => $condition->key,
            'definition_hash' => $condition->definitionHash(),
        ];
    }
}
