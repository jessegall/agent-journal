<?php

declare(strict_types=1);

namespace App\Data\Web;

use App\Data\Drivers\DriverLookData;
use App\Data\Navigation\NavigationCountsData;
use App\Data\Navigation\NavigationData;
use App\Data\Projects\ProjectData;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Lazy;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What every page receives beside its own page object: the installation, the viewer, how each driver family is
 * shown, the stable code of the refusal the last form was answered with, the navigation the viewer may see with
 * its counts, and for the owner the projects to choose and the one chosen.
 */
#[TypeScript]
final class AppContextData extends Data
{
    public function __construct(
        public readonly Lazy|InstallationData $installation,
        public readonly Lazy|ViewerData $viewer,
        /** @var Lazy|list<DriverLookData> */
        public readonly Lazy|array $drivers,
        public readonly string|Optional $refusalCode,
        public readonly Lazy|NavigationData|Optional $navigation,
        public readonly Lazy|NavigationCountsData|Optional $navigationCounts,
        /** @var list<ProjectData>|Optional */
        #[DataCollectionOf(ProjectData::class)]
        public readonly array|Optional $projects = new Optional(),
        // The chosen project's id; null while All projects are shown.
        public readonly string|null|Optional $selectedProject = new Optional(),
    ) {}
}
