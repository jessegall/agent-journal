<?php

declare(strict_types=1);

namespace App\Agents\Commands\DeliverAgent;

use App\Agents\DriverBudgets;
use App\Agents\DriverRequestLedger;
use App\Agents\Drivers\Contracts\AttachmentReferences;
use App\Agents\Drivers\Enums\DriverOperation;
use App\Bus\Contracts\CommandHandler;
use App\Exceptions\DriverRequestRefused;
use App\Messages\Data\MessageAttachmentData;
use App\Values\DriverReceipt;
use App\Values\DriverRequestPayload;

final readonly class DeliverAgentHandler implements CommandHandler
{
    public function __construct(
        private DriverRequestLedger $requests,
        private DriverBudgets $budgets,
        private AttachmentReferences $attachments,
    ) {}

    /**
     * Every part is checked before any is accepted: a delivery with one part that cannot go is refused whole.
     */
    public function handle(DeliverAgentCommand $command): DriverReceipt
    {
        if ($command->parts === []) {
            throw DriverRequestRefused::noParts();
        }

        if (! $this->budgets->fitsDelivery($command->textBytes())) {
            throw DriverRequestRefused::messageTooLarge($command->textBytes(), $this->budgets->deliverMaxBytes);
        }

        foreach ($command->parts as $part) {
            if ($part instanceof MessageAttachmentData) {
                $this->attachments->assertReadable($part, $command->sessionId);
            }
        }

        return $this->requests->append(
            $command->target(),
            DriverOperation::Deliver,
            $command->idempotencyKey,
            DriverRequestPayload::parts($command->parts),
        )->receipt;
    }
}
