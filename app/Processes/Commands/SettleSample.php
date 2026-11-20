<?php

declare(strict_types=1);

namespace App\Processes\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Processes\Handlers\SettleSampleHandler;
use App\Processes\Policies\ProcessPolicy;
use App\Processes\Values\SampleOutcome;

/**
 * Judges a request's ended sample run: complete evidence moves the request on to its proof, anything else back to
 * the owner's approval with the attempt kept.
 *
 * @extends Command<SampleOutcome>
 */
#[HandledBy(SettleSampleHandler::class)]
#[Authorize(ProcessPolicy::class, AccessType::Edit)]
final readonly class SettleSample extends Command
{
    public function __construct(public string $commandRequestId) {}
}
