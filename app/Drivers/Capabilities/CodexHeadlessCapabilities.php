<?php

declare(strict_types=1);

namespace App\Drivers\Capabilities;

use App\Drivers\Contracts\DriverCapabilities;
use App\Drivers\Enums\DriverCapability;
use App\Drivers\Values\BoundTarget;
use App\Drivers\Values\OperationSupport;
use App\Drivers\Values\SupportSnapshot;

/**
 * What Codex headless can do: what every headless driver can, but not resume a thread exactly, since its
 * app-server owner cannot yet reopen a thread after it restarts and a guessed replacement is never offered.
 */
final readonly class CodexHeadlessCapabilities implements DriverCapabilities
{
    public const string NO_EXACT_RESUME = 'Codex headless cannot reopen an earlier thread yet; start it in a new conversation.';

    public function capabilities(BoundTarget $target): SupportSnapshot
    {
        return SupportSnapshot::allowingAllBut([
            ...HeadlessCapabilities::unsupportedWithoutTerminal(),
            [DriverCapability::ExactResume, OperationSupport::unsupported(self::NO_EXACT_RESUME)],
        ]);
    }
}
