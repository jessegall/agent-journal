<?php

declare(strict_types=1);

namespace App\CommandRules\Commands\SettleSample;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\CommandRules\Values\SampleOutcome;
use App\Policies\ProcessPolicy;
use App\Support\Command;

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
