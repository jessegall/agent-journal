<?php

declare(strict_types=1);

namespace App\Commands\SendDriverRequestAgain;

use App\Contracts\Bus\CommandHandler;
use App\Enums\DriverOperation;
use App\Exceptions\DriverRequestRefused;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Values\DriverRequestPayload;

final readonly class SendDriverRequestAgainHandler implements CommandHandler
{
    private const string KEY_PREFIX = 'again-';

    public function handle(SendDriverRequestAgainCommand $command): string
    {
        $original = DriverRequest::lockedById($command->requestId);
        $runtime = AgentRuntime::query()->findOrFail($original->agent_runtime_id);
        $key = self::KEY_PREFIX.$original->id;

        // A second press answers the request the first one made.
        $sent = DriverRequest::query()->where(
            'agent_runtime_id',
            $runtime->id,
        )->where('idempotency_key', $key)->first();

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
            DriverRequestPayload::parts($original->partList()),
        );

        $again->accept();
        $again->markPossibleDuplicateOf($original);

        return $again->id;
    }
}
