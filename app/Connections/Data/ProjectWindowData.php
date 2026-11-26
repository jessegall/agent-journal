<?php

declare(strict_types=1);

namespace App\Connections\Data;

use App\Projects\Enums\ProjectWindowStatus;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * The Project window: where the connected project's tree stands, the project and the machine it is on, and its
 * root entries with the folders the user opened, and the address of Connect a project; no project is connected
 * when its labels are null.
 */
#[TypeScript]
final class ProjectWindowData extends Data
{
    /**
     * @param  list<ProjectTreeEntryData>  $entries
     */
    public function __construct(
        public readonly ProjectWindowStatus $status,
        public readonly string|null $projectLabel,
        public readonly string|null $machineLabel,
        public readonly string $connectAddress,
        #[DataCollectionOf(ProjectTreeEntryData::class)]
        public readonly array $entries = [],
    ) {}
}
