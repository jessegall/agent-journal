<?php

declare(strict_types=1);

namespace App\Supervision\Handlers;

use App\Contracts\CommandHandler;
use App\Records\Contracts\RecordResolver;
use App\Supervision\Commands\WithdrawWorkChain;
use App\Supervision\Enums\WorkChainEnding;
use App\Supervision\Models\CodeReview;
use App\Supervision\Support\WorkChainEnd;

/**
 * Ends the chain for an actor that may change the work it is about.
 */
final readonly class WithdrawWorkChainHandler implements CommandHandler
{
    public function __construct(private RecordResolver $records, private WorkChainEnd $chains) {}

    public function handle(WithdrawWorkChain $command): void
    {
        $this->records->requireWritable($command->work);
        $this->chains->end(CodeReview::latestFor($command->work), WorkChainEnding::Withdrawn);
    }
}
