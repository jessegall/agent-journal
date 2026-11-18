<?php

declare(strict_types=1);

namespace App\Hooks\Storage;

use App\Hooks\Exceptions\StoredValueInvalid;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * Every step of one walk, in order, as it is kept with the hook call.
 */
final class RecordedSteps extends Data
{
    public const int CURRENT_VERSION = 1;

    /**
     * @param  list<WalkStep>  $steps
     */
    public function __construct(
        public readonly int $version,
        #[DataCollectionOf(WalkStep::class)]
        public readonly array $steps,
    ) {}

    /**
     * @param  list<WalkStep>  $steps
     */
    public static function of(array $steps): self
    {
        return new self(self::CURRENT_VERSION, $steps);
    }

    public function checkVersion(): self
    {
        if ($this->version !== self::CURRENT_VERSION) {
            throw StoredValueInvalid::forVersion('steps', $this->version);
        }

        return $this;
    }
}
