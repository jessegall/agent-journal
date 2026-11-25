<?php

declare(strict_types=1);

namespace App\Data\Sharing;

use App\Data\Pages\CurrentUserData;
use App\Data\Projects\ProjectData;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * What every page receives beside its own page object: the application name and, once signed in, the user,
 * whether they may share records, the stable code of the refusal the last form was answered with, what is wrong with
 * the installation that it could not heal by itself, and for the owner the projects to choose and the one chosen.
 */
#[TypeScript]
final class SharedData extends Data
{
    public function __construct(
        public readonly string $name,
        // The version the sidebar shows: a release tag on main, else the short commit hash.
        public readonly string $version,
        public readonly CurrentUserData|Optional $currentUser = new Optional(),
        public readonly bool|Optional $canShare = new Optional(),
        public readonly string|Optional $refusalCode = new Optional(),
        /** @var list<string> */
        public readonly array $installationFaults = [],
        /** @var list<ProjectData>|Optional */
        #[DataCollectionOf(ProjectData::class)]
        public readonly array|Optional $projects = new Optional(),
        // The chosen project's id; null while All projects are shown.
        public readonly string|null|Optional $selectedProject = new Optional(),
    ) {}
}
