<?php

declare(strict_types=1);

namespace App\Support\Stored;

use App\Values\MenuStep;
use Spatie\LaravelData\Data;

/**
 * A menu step as it is stored, the shape MenuStep::toArray writes: its screen fingerprint, the label to choose or
 * the key to send, and its proof.
 *
 * @method static array<int, static> collect(mixed $items) read only from decoded JSON, so always an array
 */
final class StoredMenuStep extends Data
{
    public function __construct(
        public readonly string $fingerprint,
        public readonly string|null $choose,
        public readonly string|null $key,
        public readonly string|null $proof,
    ) {}

    public function step(): MenuStep
    {
        return new MenuStep($this->fingerprint, $this->choose, $this->key, $this->proof);
    }
}
