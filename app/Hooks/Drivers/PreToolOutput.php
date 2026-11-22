<?php

declare(strict_types=1);

namespace App\Hooks\Drivers;

use App\Hooks\Enums\DriverPermission;
use App\Hooks\Enums\HookEvent;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

/**
 * The hook-specific part of a pre-tool reply. A field left out is omitted from the wire, so a neutral reply names no
 * permission.
 */
final class PreToolOutput extends Data
{
    /**
     * @param  array<string, mixed>|Optional  $updatedInput  the driver's own tool arguments, kept whole
     */
    public function __construct(
        public readonly string $hookEventName = HookEvent::PreToolUse->value,
        public readonly DriverPermission|Optional $permissionDecision = new Optional(),
        public readonly string|Optional $permissionDecisionReason = new Optional(),
        public readonly string|Optional $additionalContext = new Optional(),
        public readonly array|Optional $updatedInput = new Optional(),
    ) {}

    /**
     * The context lines for the agent as one text, absent when there are none.
     *
     * @param  list<string>  $context
     */
    public static function contextText(array $context): string|Optional
    {
        return $context === [] ? Optional::create() : implode("\n", $context);
    }
}
