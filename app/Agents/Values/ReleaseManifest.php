<?php

declare(strict_types=1);

namespace App\Agents\Values;

use App\Agents\Enums\HostProtocolVersion;
use App\Agents\Exceptions\ReleaseManifestInvalid;
use App\Agents\Exceptions\ReleaseMissing;

/**
 * The files a published journal-agent release holds for each target, read from the manifest journal-release wrote
 * (release.Manifest in tools/journal-agent). Only a file this manifest names is ever served.
 */
final readonly class ReleaseManifest
{
    /**
     * @param  array<string, array<string, ReleaseFile>>  $files  by target folder (darwin-arm64), each file by the
     *                                                            name it is installed under
     */
    private function __construct(public string $version, public int $protocolVersion, private array $files) {}

    /**
     * @param  array<mixed>  $manifest
     *
     * @throws ReleaseManifestInvalid
     */
    public static function parse(string $version, array $manifest): self
    {
        if (($manifest['version'] ?? null) !== $version) {
            throw ReleaseManifestInvalid::for($version, 'it names another version');
        }

        $files = [];

        foreach (self::listAt($version, $manifest, 'targets') as $target) {
            $folder = self::stringAt($version, $target, 'os').'-'.self::stringAt($version, $target, 'arch');

            foreach (self::listAt($version, $target, 'artifacts') as $artifact) {
                $files[$folder][self::stringAt($version, $artifact, 'name')] = new ReleaseFile(
                    self::stringAt($version, $artifact, 'source'),
                    self::stringAt($version, $artifact, 'sha256'),
                );
            }
        }

        $protocolVersion = $manifest['hostProtocolVersion'] ?? null;

        if (! is_int($protocolVersion)) {
            throw ReleaseManifestInvalid::for($version, 'it names no protocol version');
        }

        return new self($version, $protocolVersion, $files);
    }

    /**
     * The path inside the release folder of the file the target installs under this name.
     *
     * @throws ReleaseMissing
     */
    public function sourceOf(string $target, string $name): string
    {
        return $this->fileOf($target, $name)->source;
    }

    /**
     * The SHA-256 of a file every target installs alike under this name, such as a shell script.
     *
     * @throws ReleaseMissing
     */
    public function sharedDigestOf(string $name): string
    {
        $digests = [];

        foreach (array_keys($this->files) as $target) {
            $digests[$this->fileOf($target, $name)->sha256] = true;
        }

        if (count($digests) !== 1) {
            throw ReleaseMissing::artifact($this->version, 'every target alike', $name);
        }

        return (string) array_key_first($digests);
    }

    /**
     * Whether the release speaks a protocol this journal speaks.
     */
    public function speaksSpokenProtocol(): bool
    {
        return HostProtocolVersion::tryFrom($this->protocolVersion) !== null;
    }

    /**
     * @throws ReleaseMissing
     */
    private function fileOf(string $target, string $name): ReleaseFile
    {
        if (! isset($this->files[$target][$name])) {
            throw ReleaseMissing::artifact($this->version, $target, $name);
        }

        return $this->files[$target][$name];
    }

    /**
     * @param  array<mixed>  $object
     * @return list<array<mixed>>
     *
     * @throws ReleaseManifestInvalid
     */
    private static function listAt(string $version, array $object, string $key): array
    {
        $members = $object[$key] ?? null;

        if (! is_array($members) || ! array_is_list($members)) {
            throw ReleaseManifestInvalid::for($version, "{$key} is not a list");
        }

        $objects = [];

        foreach ($members as $member) {
            if (! is_array($member)) {
                throw ReleaseManifestInvalid::for($version, "an entry of {$key} is not an object");
            }

            $objects[] = $member;
        }

        return $objects;
    }

    /**
     * @param  array<mixed>  $object
     *
     * @throws ReleaseManifestInvalid
     */
    private static function stringAt(string $version, array $object, string $key): string
    {
        $name = $object[$key] ?? null;

        if (! is_string($name) || $name === '') {
            throw ReleaseManifestInvalid::for($version, "{$key} is not a name");
        }

        return $name;
    }
}
