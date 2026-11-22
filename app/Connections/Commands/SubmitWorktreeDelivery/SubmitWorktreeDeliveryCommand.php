<?php

declare(strict_types=1);

namespace App\Connections\Commands\SubmitWorktreeDelivery;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Connections\Values\DeliveryReceipt;
use App\Connections\Values\DeliverySubmission;

/**
 * A child's relay submits its broker-verified commit for integration; only the host of the claim's binding may.
 *
 * @extends Command<DeliveryReceipt>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class SubmitWorktreeDeliveryCommand extends Command
{
    public function __construct(public string $hostId, public DeliverySubmission $submission) {}
}
