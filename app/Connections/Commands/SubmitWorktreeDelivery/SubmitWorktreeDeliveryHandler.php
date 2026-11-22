<?php

declare(strict_types=1);

namespace App\Connections\Commands\SubmitWorktreeDelivery;

use App\Connections\Exceptions\DeliveryRefused;
use App\Connections\Models\ChildClaim;
use App\Connections\Models\ProjectBinding;
use App\Connections\Models\WorktreeDelivery;
use App\Connections\Values\DeliveryReceipt;
use App\Contracts\CommandHandler;

/**
 * Checks the claim is the calling host's binding's, records the delivery once and answers its receipt.
 */
final readonly class SubmitWorktreeDeliveryHandler implements CommandHandler
{
    public function handle(SubmitWorktreeDeliveryCommand $command): DeliveryReceipt
    {
        $claim = ChildClaim::query()->whereKey($command->submission->childClaimId)->firstOrFail();
        $binding = ProjectBinding::lockById($claim->binding_id);

        if (! $binding->isReportableBy($command->hostId)) {
            throw DeliveryRefused::notYourClaim($claim->id);
        }

        return WorktreeDelivery::submit($claim, $command->submission)->receipt();
    }
}
