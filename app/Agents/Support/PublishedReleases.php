<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Data\ReleaseCompatibilityData;
use App\Agents\Data\ReleaseOfferData;
use App\Agents\Data\ReleaseTargetData;
use App\Agents\Enums\HostProtocolVersion;
use App\Agents\Exceptions\ReleaseMissing;
use App\Agents\Values\ReleaseArtifact;
use App\Agents\Values\ReleaseManifest;
use App\Files\Contracts\Files;
use App\Files\Enums\Place;
use App\Files\Values\FilePath;

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
        if ($this->current === '') {
            return false;
        }

        if (! $this->files->exists(FilePath::in(Place::Releases, "{$this->current}/".self::MANIFEST))) {
            return false;
        }

        return $this->manifestOf($this->current)->isPublic();
    }

    /**
     * What the window shows beside Copy: each platform of the current release with its size and prerequisites, the
     * platforms and providers it withholds, and the capabilities it lacks; nothing while no release is published.
     */
    public function offer(): ReleaseOfferData
    {
        if ($this->current === '' || ! $this->files->exists(FilePath::in(Place::Releases, "{$this->current}/".self::MANIFEST))) {
            return ReleaseOfferData::from(['release' => null, 'targets' => [], 'withheldCapabilities' => ReleaseManifest::CAPABILITIES]);
        }

        $manifest = $this->manifestOf($this->current);

        return ReleaseOfferData::from([
            'release' => $manifest->version,
            'targets' => array_map(ReleaseTargetData::fromTarget(...), $manifest->targets),
            'withheldCapabilities' => $manifest->withheldCapabilities(),
        ]);
    }

    /**
     * What a relay of any protocol may ask before it calls anything else: the current release and every protocol
     * version this journal speaks.
     */
    public function compatibility(): ReleaseCompatibilityData
    {
        return ReleaseCompatibilityData::from([
            'release' => $this->current === '' ? null : $this->current,
            'protocolVersions' => HostProtocolVersion::spoken(),
        ]);
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
