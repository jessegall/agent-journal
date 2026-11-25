<?php

declare(strict_types=1);

namespace Domain\Chat\Data;

use App\Enums\StatusActionType;
use App\Support\StatusAction;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One thing an agent's status offers now: its type, which the page maps to a route or dialog, and its button's words.
 *
 * @method static static from(array<string, mixed> $action)
 */
#[TypeScript]
final class StatusActionData extends Data
{
    public function __construct(
        public readonly StatusActionType $type,
        public readonly string $label,
    ) {}

    public static function fromStatusAction(StatusAction $action): self
    {
        return self::from([
            'type' => $action->type,
            'label' => $action->label,
        ]);
    }
}
