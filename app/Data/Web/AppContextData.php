<?php

declare(strict_types=1);

namespace App\Data\Web;

use App\Data\Drivers\DriverLookData;
use App\Data\Navigation\NavigationCountsData;
use App\Data\Navigation\NavigationData;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Lazy;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What every page receives beside its own page object: the installation, the viewer, how each driver family is
 * shown, the stable code of the refusal the last form was answered with, and the navigation the viewer may see with
 * its counts.
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
    ) {}
}
