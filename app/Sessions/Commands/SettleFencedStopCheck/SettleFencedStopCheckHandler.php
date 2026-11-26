<?php

declare(strict_types=1);

namespace App\Sessions\Commands\SettleFencedStopCheck;

use App\Accounts\Enums\CommandEntry;
use App\Bus\Contracts\CommandHandler;
use App\Bus\Contracts\JournalCommands;
use App\Hooks\Data\StopConditionResultData;
use App\Hosts\Enums\HostOrderStatus;
use App\Models\Hosts\HostOrder;
use App\Models\Sessions\StopCheck;
use App\Sessions\Commands\RecordStopConditionResults\RecordStopConditionResultsCommand;
use App\Sessions\Contracts\SessionPolicyReader;
use App\Sessions\Enums\StopCheckStatus;
use App\Values\StopCondition;
use App\Values\StopConditionResultReport;

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
        $order = HostOrder::findLocked($command->orderId);

        foreach (StopCheck::findRunUnder($order->id) as $attempt) {
            if ($attempt->status !== StopCheckStatus::Pending) {
                return;
            }

            if ($order->status === HostOrderStatus::Refused) {
                $reason = "the host refused to run the conditions: {$order->refusal?->value}";
                $attempt->settle(StopCheckStatus::Unresolved, self::REFUSED_SUBMISSION, $reason);

                return;
            }

            $conditions = $this->policies->policyFor($attempt->session_id)->stopConditions->conditions;
            $results = array_values($order->answer->facts['results'] ?? []);

            $reports = array_map(
                fn (array $result, int $index) => $this->reportOf($conditions[$index], $result),
                $results,
                array_keys($results),
            );

            $record = new RecordStopConditionResultsCommand(
                $order->host_id,
                $attempt->id,
                $attempt->policy_digest,
                $attempt->workspace_generation,
                $reports,
            );

            $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $record);
        }
    }

    /**
     * The host's result of the run, the condition's own in the order the conditions ran.
     *
     * @param  array<string, mixed>  $result
     */
    private function reportOf(StopCondition $condition, array $result): StopConditionResultReport
    {
        return StopConditionResultData::from([
            ...$result,
            'condition_key' => $condition->key,
            'definition_hash' => $condition->definitionHash(),
        ])->report();
    }
}
