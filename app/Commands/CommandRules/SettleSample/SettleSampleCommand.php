<?php

declare(strict_types=1);

namespace App\Commands\CommandRules\SettleSample;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\ProcessPolicy;
use App\Support\Command;
use App\Values\SampleOutcome;

/**
 * Judges a request's ended sample run: complete evidence moves the request on to its proof, anything else back to
 * the owner's approval with the attempt kept.
 *
 * @extends Command<SampleOutcome>
 */
#[Authorize(ProcessPolicy::class, AccessType::Edit)]
final readonly class SettleSampleCommand extends Command
{
    public function __construct(public string $commandRequestId) {}
}
