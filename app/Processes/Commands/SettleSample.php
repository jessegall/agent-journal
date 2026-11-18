<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Processes\Handlers\SettleSampleHandler;
use App\Processes\Values\SampleOutcome;

/**
 * Judges a request's ended sample run: complete evidence moves the request on to its proof, anything else back to
 * the owner's approval with the attempt kept.
 *
 * @implements Command<SampleOutcome>
 */
#[HandledBy(SettleSampleHandler::class)]
final readonly class SettleSample implements Command
{
    public function __construct(public string $commandRequestId) {}
}
