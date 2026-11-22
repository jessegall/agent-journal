<?php

declare(strict_types=1);

namespace Domain\Helpers\Commands\SteerHelper;

use App\Actors\Support\ActorIdentity;
use Domain\Helpers\Commands\Support\HelperCommandHandler;
use Domain\Helpers\Enums\JobState;
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
            fn () => throw HelperUnavailable::toYou(),
        );

        $latest = HelperJob::query()->ofIdentities([$identity->id])->latest('id')->lockForUpdate()->first();

        if ($latest !== null && $latest->state->isLive()) {
            $latest->addSteering($command->text);

            return SteerReceipt::steered($latest->id);
        }

        $suggestedCommand = $latest !== null && $latest->state === JobState::Unfinished
            ? $this->starts->continueCommand($latest)
            : sprintf(
                'journal helper send %s --brief %s',
                escapeshellarg($identity->id),
                escapeshellarg($command->text),
            );

        $message = HelperMessage::create(
            ActorIdentity::of($command->dispatchedBy()),
            $identity,
            $command->text,
            $suggestedCommand,
        );

        return SteerReceipt::kept($message->id, $suggestedCommand);
    }
}
