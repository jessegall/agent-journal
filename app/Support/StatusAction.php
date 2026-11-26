<?php

declare(strict_types=1);

namespace App\Support;

use App\Agents\Enums\StatusActionType;

/**
 * One thing an agent's status offers now: its type and its button's words.
 */
final readonly class StatusAction
{
    public function __construct(
        public StatusActionType $type,
        public string $label,
    ) {}

    public static function of(StatusActionType $type): self
    {
        return new self($type, $type->label());
    }

    /**
     * A retry that names the operation it repeats, such as Retry switch.
     */
    public static function retry(string $operation): self
    {
        return new self(StatusActionType::Retry, "Retry {$operation}");
    }
}
