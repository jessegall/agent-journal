<?php

declare(strict_types=1);

namespace Domain\Plans\Console\Concerns;

use App\AgentRequests\Contracts\AgentRequestSender;
use App\AgentRequests\Exceptions\AgentRequestFailed;
use Domain\Plans\Http\Data\PlanWorkResultData;
use Illuminate\Support\Str;

/**
 * What the cascade commands share: the root by its type and id arguments, the signed call
 * as the agent of the launch, and a summary that says the whole plan or phase was covered, not one record.
 */
trait SendsPlanWorkCommands
{
    /**
     * @param  array<string, mixed>  $fields
     */
    protected function sendCascade(AgentRequestSender $journal, string $verb, array $fields): int
    {
        $given = (string) $this->option('request-key');
        $requestKey = $given !== '' ? $given : (string) Str::ulid();

        try {
            $reply = $journal->send("/agent/plans/work/{$verb}", [
                'rootType' => (string) $this->argument('type'),
                'rootId' => (string) $this->argument('id'),
                ...$fields,
                'request_key' => $requestKey,
            ]);
        } catch (AgentRequestFailed $failure) {
            $this->error($failure->getMessage());
            $this->error("Retry with --request-key={$requestKey} to get this write's answer without making it twice.");

            return self::FAILURE;
        }

        if ($this->option('json')) {
            $this->line(json_encode($reply->body, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES));

            return self::SUCCESS;
        }

        $work = PlanWorkResultData::from($reply->body);
        $this->line("Cascade over {$work->root->recordType} {$work->root->recordId} and its unfinished work: {$work->changed} changed, {$work->unchanged} unchanged, {$work->skipped} skipped as finished.");

        return self::SUCCESS;
    }
}
