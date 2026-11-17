<?php

declare(strict_types=1);

namespace App\Core\Hooks\Programs;

use App\Core\Hooks\Enums\ProgramPermission;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

/**
 * The hook-specific part of a pre-tool reply. A field left out is omitted from the wire, so a neutral reply names no permission.
 */
final class PreToolOutput extends Data
{
    /**
     * @param  array<string, mixed>|Optional  $updatedInput  the program's own tool arguments, kept whole
     */
    public function __construct(
        public readonly string $hookEventName = 'PreToolUse',
        public readonly ProgramPermission|Optional $permissionDecision = new Optional,
        public readonly string|Optional $permissionDecisionReason = new Optional,
        public readonly string|Optional $additionalContext = new Optional,
        public readonly array|Optional $updatedInput = new Optional,
    ) {}
}
