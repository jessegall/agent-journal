<?php

declare(strict_types=1);

namespace App\Commands\SubmitWorktreeDelivery;

use App\Contracts\Bus\CommandHandler;
use App\Exceptions\DeliveryRefused;
use App\Models\ChildClaim;
use App\Models\ProjectBinding;
use App\Models\WorktreeDelivery;
use App\Values\DeliveryReceipt;

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
