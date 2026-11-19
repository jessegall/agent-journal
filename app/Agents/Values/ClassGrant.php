<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;

/**
 * The access types a policy grants on one resource area.
 */
final readonly class ClassGrant
{
    /**
     * @param  list<AccessType>  $accessTypes
     */
    public function __construct(
        public ResourceAreaType $area,
        public array $accessTypes,
    ) {}

    public function grants(AccessType $access, ResourceAreaType $area): bool
    {
        return $area === $this->area && in_array($access, $this->accessTypes, true);
    }

    /**
     * Whether the grant lets a holder change files of the workspace.
     */
    public function changesWorkspaceFiles(): bool
    {
        return $this->area->hasWorkspaceFiles()
            && array_any($this->accessTypes, fn (AccessType $access) => $access->changesFiles());
    }
}
