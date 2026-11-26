<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Capabilities;

use App\Agents\Drivers\Contracts\DriverCapabilities;
use App\Agents\Drivers\Enums\DriverCapability;
use App\Values\BoundTarget;
use App\Values\OperationSupport;
use App\Values\SupportSnapshot;

/**
 * What Codex headless can do: what every headless driver can, but not resume a thread exactly, as a guessed
 * replacement is never offered, nor share its account, as each exec turn refreshes the account's sign-in itself.
 */
final readonly class CodexHeadlessCapabilities implements DriverCapabilities
{
    /**
     * Codex's sandbox limits writes only, so its tools could read its sign-in in a shared container.
     */
    public const string NOT_CONTAINABLE = "Codex's sandbox does not keep tools from its sign-in; container starts wait for the provider transport";

    public const string NO_EXACT_RESUME = 'Codex headless cannot reopen an earlier thread yet; start it in a new conversation.';

    public function capabilities(BoundTarget $target): SupportSnapshot
    {
        return SupportSnapshot::allowingAllBut([
            ...HeadlessCapabilities::unsupportedWithoutTerminal(),
            [DriverCapability::ExactResume, OperationSupport::unsupported(self::NO_EXACT_RESUME)],
            [DriverCapability::RunContained, OperationSupport::unsupported(self::NOT_CONTAINABLE)],
        ]);
    }
}
