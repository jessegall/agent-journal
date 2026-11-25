<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands\SteerHelper;

use Domain\Helpers\Commands\Support\HelperCommandHandler;
use Domain\Helpers\Enums\JobStatus;
use Domain\Helpers\Exceptions\HelperUnavailable;
use Domain\Helpers\Models\HelperIdentity;
use Domain\Helpers\Models\HelperJob;
use Domain\Helpers\Models\HelperMessage;
use Domain\Helpers\Support\HelperStarts;
use Domain\Helpers\Values\SteerReceipt;

final readonly class SteerHelperHandler extends HelperCommandHandler
{
    public function __construct(private HelperStarts $starts) {}

    public function handle(SteerHelperCommand $command): SteerReceipt
    {
        $identity = HelperIdentity::query()->whereKey($command->identityId)->firstOr(
            HelperUnavailable::throwing()->toYou(),
        );

        $latest = HelperJob::query()->ofIdentities([$identity->id])->newestFirst()->lockForUpdate()->first();

        if ($latest !== null && $latest->status->isLive()) {
            $latest->addSteering($command->text);

            return SteerReceipt::steered($latest->id);
        }

        $suggestedCommand = $latest !== null && $latest->status === JobStatus::Unfinished
            ? $this->starts->continueCall($latest)
            : HelperStarts::sendCallFor($identity->id, "its model and the brief '{$command->text}'");

        $message = HelperMessage::create(
            $command->dispatchedBy(),
            $identity,
            $command->text,
            $suggestedCommand,
        );

        return SteerReceipt::kept($message->id, $suggestedCommand);
    }
}
