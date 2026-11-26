<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Actors\Contracts\CurrentActor;
use App\CommandRules\Enums\ReceiptStatus;
use App\CommandRules\ReceiptCallers;
use App\Models\CommandRules\CommandReceipt;
use PHPUnit\Framework\Assert;

/**
 * What the journal fixture reads of the receipt a keyed command left: the receipt the actor in place sees for the
 * command and key, as the bus reads it, and its status and replayed reply.
 */
trait AssertsReceipts
{
    /**
     * The receipt the actor in place, in its session unless the command keeps its key for the actor alone, holds for
     * the command under the key.
     */
    public function commandReceipt(object $command, string $requestKey): CommandReceipt
    {
        $receipt = $this->visibleReceipt($command, $requestKey);
        Assert::assertNotNull($receipt, 'The actor in place has no receipt of '.$command::class.' under that key.');

        return $receipt;
    }

    public function assertReceiptStatus(CommandReceipt $receipt, ReceiptStatus $status): self
    {
        Assert::assertSame($status, $receipt->status);

        return $this;
    }

    /**
     * The receipt answers a retry with the reply given, without running the command again.
     */
    public function assertReplayedReply(CommandReceipt $receipt, mixed $reply): self
    {
        Assert::assertEquals($reply, $receipt->replay());

        return $this;
    }

    /**
     * The actor in place holds no receipt of the command under the key.
     */
    public function assertNoReceipt(object $command, string $requestKey): self
    {
        Assert::assertNull(
            $this->visibleReceipt($command, $requestKey),
            'The actor in place holds a receipt of '.$command::class.' under that key.',
        );

        return $this;
    }

    private function visibleReceipt(object $command, string $requestKey): CommandReceipt|null
    {
        $actor = $this->app->make(CurrentActor::class)->actor();
        $caller = $this->app->make(ReceiptCallers::class)->forCommand($command::class, $actor);

        return CommandReceipt::findReadFor($caller, $command::class, $requestKey);
    }
}
