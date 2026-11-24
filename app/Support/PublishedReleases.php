<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Files\Files;
use App\Data\Images\ReleaseCompatibilityData;
use App\Enums\Place;
use App\Exceptions\ReleaseMissing;
use App\Values\FilePath;
use App\Values\ReleaseArtifact;
use App\Values\ReleaseManifest;

/**
 * The journal-agent releases this journal publishes: one folder per version in the releases place, as journal-release
 * wrote it, and the current version connected machines install.
 */
final readonly class PublishedReleases
{
    public const string MANIFEST = 'manifest.json';

    public const string SIGNATURE = 'manifest.json.sig';

    public function __construct(private Files $files, private string $current) {}

    /**
     * The manifest of the current release, read.
     *
     * @throws ReleaseMissing
     */
    public function current(): ReleaseManifest
    {
        return $this->manifestOf($this->currentVersion());
    }

    /**
     * The signed manifest of the current release.
     *
     * @throws ReleaseMissing
     */
    public function currentManifest(): string
    {
        return $this->files->realPath($this->fileOf($this->currentVersion(), self::MANIFEST));
    }

    /**
     * The detached signature over the current release's manifest.
     *
     * @throws ReleaseMissing
     */
    public function currentSignature(): string
    {
        return $this->files->realPath($this->fileOf($this->currentVersion(), self::SIGNATURE));
    }

    /**
     * The file a release's manifest names for the target under this name; no other file of the folder is served.
     *
     * @throws ReleaseMissing
     */
    public function artifact(ReleaseArtifact $artifact): string
    {
        $source = $this->manifestOf($artifact->version)->sourceOf($artifact->target, $artifact->name);

        return $this->files->realPath($this->fileOf($artifact->version, $source));
    }

    /**
     * Whether a current release is published whose manifest speaks a protocol this journal speaks, has every
     * capability a public install line needs and ships for a platform with its sizes, prerequisites and providers.
     */
    public function hasCompatibleRelease(): bool
    {
        return $this->hasCurrentManifest() && $this->manifestOf($this->current)->canBeOffered();
    }

    /**
     * The manifest of the current release, if one is published: none or one.
     *
     * @return list<ReleaseManifest>
     */
    public function currentRelease(): array
    {
        return $this->hasCurrentManifest() ? [$this->manifestOf($this->current)] : [];
    }

    /**
     * What a relay may ask before it calls anything else: the release this journal publishes.
     */
    public function compatibility(): ReleaseCompatibilityData
    {
        return ReleaseCompatibilityData::from([
            'release' => $this->current === '' ? null : $this->current,
        ]);
    }

    private function hasCurrentManifest(): bool
    {
        return $this->current !== ''
            && $this->files->exists(FilePath::in(Place::Releases, "{$this->current}/".self::MANIFEST));
    }

    /**
     * @throws ReleaseMissing
     */
    private function currentVersion(): string
    {
        if ($this->current === '') {
            throw ReleaseMissing::noneCurrent();
        }

        return $this->current;
    }

    /**
     * @throws ReleaseMissing
     */
    private function manifestOf(string $version): ReleaseManifest
    {
        return ReleaseManifest::parse($version, $this->files->readJson($this->fileOf($version, self::MANIFEST)));
    }

    /**
     * @throws ReleaseMissing
     */
    private function fileOf(string $version, string $relative): FilePath
    {
        $file = FilePath::in(Place::Releases, "{$version}/{$relative}");

        if (! $this->files->exists($file)) {
            throw ReleaseMissing::version($version);
        }

        return $file;
    }
}
