<?php

declare(strict_types=1);

namespace App\Commands\WithdrawWorkChain;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Records\RecordResolver;
use App\Enums\WorkChainEnding;
use App\Models\CodeReview;
use App\Support\WorkChainEnd;

/**
 * Ends the chain for an actor that may change the work it is about.
 */
final readonly class WithdrawWorkChainHandler implements CommandHandler
{
    public function __construct(private RecordResolver $records, private WorkChainEnd $chains) {}

    public function handle(WithdrawWorkChainCommand $command): void
    {
        $this->records->requireWritable($command->work);
        $this->chains->end(CodeReview::latestFor($command->work), WorkChainEnding::Withdrawn);
    }
}
