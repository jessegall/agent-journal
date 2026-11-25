<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Agents\AccessType;
use App\Enums\Profiles\ResourceType;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * One scope a profile may work in on the host, with the accesses it permits there: a root path ('.' is the whole
 * workspace the driver's own sandbox confines it to) or a network destination ('*' is any destination).
 */
#[MapName(SnakeCaseMapper::class)]
final class HostAccess extends Data
{
    /**
     * @param  list<AccessType>  $accesses
     */
    public function __construct(public readonly ResourceType $type, public readonly string $scope, public readonly array $accesses) {}

    /**
     * @param  list<AccessType>  $accesses
     */
    public static function root(string $root, array $accesses): self
    {
        return new self(ResourceType::Path, $root, $accesses);
    }

    /**
     * @param  list<AccessType>  $accesses
     */
    public static function destination(string $destination, array $accesses): self
    {
        return new self(ResourceType::Destination, $destination, $accesses);
    }

    public function permits(AccessType $access): bool
    {
        return in_array($access, $this->accesses, true);
    }

    /**
     * Whether the operand lies in this scope: a path at the root or below it at a path boundary, a destination that
     * is this one or any.
     */
    public function covers(ResourceRequest $resource): bool
    {
        if ($resource->type !== $this->type) {
            return false;
        }

        if ($this->type === ResourceType::Destination) {
            return $this->scope === '*' || $this->scope === $resource->target;
        }

        $path = $resource->normalizedPath();
        $root = new ResourceRequest(ResourceType::Path, $this->scope)->normalizedPath();

        return $root === '.' || $path === $root || str_starts_with($path, $root.'/');
    }

    /**
     * Whether this scope holds the other's whole scope and every access it permits.
     */
    public function contains(self $other): bool
    {
        $scope = new ResourceRequest($other->type, $other->scope);

        return $this->covers($scope)
            && ($this->type !== ResourceType::Destination || $this->scope === '*' || $other->scope !== '*')
            && array_all($other->accesses, $this->permits(...));
    }

    public function changesFiles(): bool
    {
        return $this->type === ResourceType::Path
            && array_any($this->accesses, fn (AccessType $access) => $access->changesFiles());
    }
}
