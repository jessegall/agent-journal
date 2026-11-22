<?php

declare(strict_types=1);

namespace App\Support\Stored;

use App\Enums\BindingType;
use App\Values\ExecutableBinding;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * The executable a rule or contract trusts, as a stored rule holds it.
 */
#[MapName(SnakeCaseMapper::class)]
final class StoredExecutableBinding extends Data
{
    /**
     * @param  list<string>  $locations
     */
    public function __construct(
        public readonly BindingType $type,
        public readonly string $family,
        public readonly array $locations,
        public readonly string $contentDigest,
        public readonly int $configurationRevision,
    ) {}

    public static function fromBinding(ExecutableBinding $binding): self
    {
        return self::from([
            'type' => $binding->type,
            'family' => $binding->family,
            'locations' => $binding->locations,
            'content_digest' => $binding->contentDigest,
            'configuration_revision' => $binding->configurationRevision,
        ]);
    }

    public function toBinding(): ExecutableBinding
    {
        return ExecutableBinding::stored(
            $this->type,
            $this->family,
            $this->locations,
            $this->contentDigest,
            $this->configurationRevision,
        );
    }
}
