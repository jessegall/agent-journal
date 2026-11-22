<?php

declare(strict_types=1);

namespace App\Agents\Commands\SendDriverRequestAgain;

use App\Agents\Enums\DriverOperation;
use App\Agents\Exceptions\DriverRequestRefused;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\DriverRequest;
use App\Agents\Values\DriverRequestPayload;
use App\Contracts\CommandHandler;

final readonly class SendDriverRequestAgainHandler implements CommandHandler
{
    private const string KEY_PREFIX = 'again-';

    public function handle(SendDriverRequestAgainCommand $command): string
    {
        $original = DriverRequest::query()->whereKey($command->requestId)->lockForUpdate()->firstOrFail();
        $runtime = AgentRuntime::query()->findOrFail($original->agent_runtime_id);
        $key = self::KEY_PREFIX.$original->id;

        // A second press answers the request the first one made.
        $sent = DriverRequest::query()->where('agent_runtime_id', $runtime->id)->where('idempotency_key', $key)->first();

        if ($sent !== null) {
            return $sent->id;
        }

        if (! $original->canSendAgain()) {
            throw DriverRequestRefused::notUncertain($original->id, $original->progress->value);
        }

        if (! $command->confirmsPossibleDuplicate) {
            throw DriverRequestRefused::duplicateNotConfirmed($original->id);
        }

        $again = DriverRequest::create(
            $runtime,
            DriverOperation::Deliver,
            $key,
            DriverRequestPayload::message((string) $original->message),
        );
        $again->accept();
        $again->markPossibleDuplicateOf($original);

        return $again->id;
    }
}
